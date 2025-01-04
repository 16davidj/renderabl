import express, {Request, Response} from 'express';
import {OpenAI} from 'openai'
import cors from 'cors'
import dotenv from 'dotenv'
import { AutoParseableTool } from 'openai/lib/parser';
import { cronJobNamesArray, cellNamesArray, Message, QueryJob, QueryJobSchema, Job} from './types';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { ZodType, z } from "zod";
import { zodResponseFormat, zodFunction } from "openai/helpers/zod";

dotenv.config();

const jobQueryTool : AutoParseableTool<any, any> = zodFunction({
  name: "jobQueryAgent",
  description: "Call whenever the prompt indicates we want to query for jobs that are stored in the database.",
  parameters: QueryJobSchema
})

const chatTool : AutoParseableTool<any, any> = zodFunction({
  name: "chatAgent",
  description: "Default to this whenever the other tools, such as personAgent, are not appropriate. Do not respond to the chat message itself.",
  parameters: z.object({
      messages: z.array(
      z.object({
          role: z.enum(["system", "user", "assistant"]).describe("The role of the sender of the chat message"),
          content: z.string().describe("The content of the chat message"),
      })
      )
  }), 
})

let tools: AutoParseableTool<any, any>[] = [jobQueryTool, chatTool];

const app = express();
const port = process.env.REACT_APP_PORT;
const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY})

app.use(express.json())
app.use(cors({origin: '*'}))
app.use((_, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});

const router = express.Router();
router.post('/api/getResponse', getResponse as (req: Request, res: Response) => void);
app.use(router);

const prisma = new PrismaClient();

const generateRandomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const generateRandomBoolean = (): boolean => Math.random() < 0.5;

generateCronJobData();

async function generateCronJobData(): Promise<void> {
  const jobsData = [];
  cronJobNamesArray.forEach((jobName) => {
    cellNamesArray.forEach((cellName) => {
      const job = {
        id: uuidv4(),
        name: jobName,
        cell: cellName,
        createdAt: new Date().toISOString(),
        durationMin: generateRandomInt(1, 120),
        success: generateRandomBoolean(),
        resourceUsage: generateRandomInt(1, 100) + Math.random(),
      };
      jobsData.push(job);
    });
  });

  try {
    const result = await prisma.job.createMany({
      data: jobsData,
    });
    console.log("Batch insert succeeded:", result);
  } catch (error) {
    console.error("Error during batch insert:", error);
  }
}

async function generateAndRunQuery(queryArgs: QueryJob) {
  const { filters, sort, limit } = queryArgs;

  // Base query
  const where: Record<string, any> = {};

  // Apply filters
  if (filters) {
    filters.forEach((filter: any) => {
      const { field, operator, value } = filter;
      switch (operator) {
        case "<":
        case ">":
          where[field] = { [operator]: value };
          break;
        case "before":
          where[field] = { lt: new Date(value) };
          break;
        case "after":
          where[field] = { gt: new Date(value) };
          break;
        case "equals":
          where[field] = value;
          break;
        case "notEquals":
          where[field] = { not: value };
          break;
      }
    });
  }

  // Build query
  const query = {
    where,
    orderBy: sort ? { [sort.field]: sort.order } : undefined,
    take: limit,
  };

  // Fetch results
  const jobs : Job[]= await prisma.job.findMany(query);
  console.log("jobs", JSON.stringify(jobs));
  return jobs;
}

async function getResponse(req:Request, res:Response) {
  const prompt : Message[] = req.body.messages;
  if (!req.is('application/json')) {
      return res.status(400).json({ error: 'Invalid request body' });
  }
  if (!prompt) {
    return res.status(400).json({error: "Prompt is required"});
  }
  const functionCallResponse = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{
      role: "system",
      content: `You are an agent that determines which function in the tools to call given the user's prompt. Use the entire conversation history for context, but prioritize the last user message for making your decision. If no other function is appropriate, default to calling the "chatAgent" function.`
  }, prompt[prompt.length-1]],
    tools: tools,
  });
  // const functionCallResponse = await fetch(`http://localhost:5500/api/getFunctionCallDecision`, {
  //   method:'POST',
  //   mode: 'cors',
  //   headers: {
  //       'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify({ prompt: prompt.content })
  // });
  const messageResponse : Message = await agentDeciderAndRunner(JSON.stringify(functionCallResponse))
  return res.status(200).json(messageResponse);
}

export async function jobQueryAgent(args): Promise<Message> {
  console.log(args)
  const schema : QueryJob = {filters : args.filters, sort: args.sort, limit: args.limit};
  const jobsArray = await generateAndRunQuery(schema);
  const messageResponse : Message = {
    role: "system",
    content: "list of data about recent job runs",
    jobContent: jobsArray,
    cardType: "job"
  }
  return messageResponse;
}

async function chatAgent(args: { messages: Message[]; } | Message[]) : Promise<Message> {
  let prompt : Message[];
  if (args instanceof Array) {
    prompt = args;
  } else {
    prompt = args.messages;
  }
  if (!prompt) {
    console.error("Prompt for chat agent is required");
    return;
  }
  try {
    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{
            role: "system",
            content: "You are a helpful assistant that responds to chat messages."
      }, ...prompt],
    })
    const messageResponse : Message = {
      role: "system",
      content: response.choices[0].message.content,
      cardType: "string"
    }
    return messageResponse
  } catch (error) {
    console.error('Error from OpenAI:', error)
  }
}


async function agentDeciderAndRunner(responseString : string) : Promise<Message> {
  const response = JSON.parse(responseString);
  const toolCall = response.choices[0].message.tool_calls[0];
  const functionName = toolCall.function.name;
  const args = JSON.parse(toolCall.function.arguments);
  console.log("Function Name: " + functionName + " with arguments: " + JSON.stringify(args));
  switch (functionName) {
    case "chatAgent":
      return chatAgent(args);
    case "jobQueryAgent":
      return jobQueryAgent(args);
  }
}

app.listen(port, () => {
    console.log('API listening on port:', port)
})