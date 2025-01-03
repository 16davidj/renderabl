import express, {Request, Response} from 'express';
import {OpenAI} from 'openai'
import { GolfPlayerCardStructure, Message, GolfTournamentCardStructure, PersonCardStructure} from './types'
import { GolfPlayerCardProps } from '../sampleApp/golfcards/golfplayercard';
import { GolfTournamentCardProps } from '../sampleApp/golfcards/golftournamentcard';
import { PersonCardProps } from '../sampleApp/generalcards/personcard';
import { zodResponseFormat, zodFunction } from "openai/helpers/zod";
import cors from 'cors'
import dotenv from 'dotenv'
import { connectRedis, redisClient } from '../redis/redisClient';
import { createSponsorLogoKey, createTourLogoKey } from '../redis/redisUtils';
import { ZodType, z } from "zod";
import { AutoParseableTool } from 'openai/lib/parser';

dotenv.config();

let tools: AutoParseableTool<any, any>[] = [];

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
router.post('/api/renderabl', renderableBe as (req: Request, res: Response) => void);
app.use(router);

async function renderableBe(req:Request, res:Response) {
  const prompt : Message[] = req.body.messages;
  if (!req.is('application/json')) {
      return res.status(400).json({ error: 'Invalid request body' });
  }
  if (!prompt) {
    return res.status(400).json({error: "Prompt is required"});
  }
  const toolGraphJson = await redisClient.get('toolGraph');
  const toolGraph : OpenAI.ChatCompletionTool[] = JSON.parse(toolGraphJson);
  const functionCallResponse = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{
      role: "system",
      content: `You are an agent that determines which function in the tools to call given the user's prompt. Use the entire conversation history for context, but prioritize the last user message for making your decision. If no other function is appropriate, default to calling the "chatAgent" function.`
  }, prompt[prompt.length-1]],
    tools: toolGraph,
  });
  const messageResponse : Message = await agentDeciderAndRunner(JSON.stringify(functionCallResponse), prompt)
  return res.status(200).json(messageResponse);
}

export async function golfTournamentAgent(args): Promise<Message> {
  
}

async function agentDeciderAndRunner(responseString : string, prompt : Message[]) : Promise<Message> {
  const response = JSON.parse(responseString);
  const toolCall = response.choices[0].message.tool_calls[0];
  const functionName = toolCall.function.name;
  const args = JSON.parse(toolCall.function.arguments);
  console.log("Function Name: " + functionName + " with arguments: " + JSON.stringify(args));
  switch (functionName) {
  } 
}

app.listen(port, () => {
    console.log('API listening on port:', port)
})