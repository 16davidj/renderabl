import express, {Request, Response} from 'express';
import {OpenAI} from 'openai'
import cors from 'cors'
import dotenv from 'dotenv'
import { generateComponentFile, generateToolNode, generateComponent } from '../renderableFe/renderableFeUtils';
import { connectRedis, redisClient } from '../redis/redisClient';
import { createFileKey } from '../redis/redisUtils';

dotenv.config();
const app = express();
const port = process.env.REACT_APP_PORT;

app.use(express.json())
app.use(cors({origin: '*'}))
app.use((_, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
  });
app.options('*', cors());

connectRedis();

const router = express.Router();
router.post('/api/generateRenderabl', generateAgent as (req: Request, res: Response) => void)
router.post('/api/provideContext', provideContext as (req: Request, res: Response) => void)
router.get('/api/getContext', getContext as (req: Request, res: Response) => void)
router.get('/api/getToolGraph', getToolGraph as (req: Request, res: Response) => void)
router.post('/api/writeToolGraph', writeToolGraph as (req: Request, res: Response) => void)
router.post('/api/getFunctionCallDecision', getFunctionCallDecision as (req: Request, res: Response) => void)
router.post('/api/writeToolNode', writeToolNodeEndpoint as (req: Request, res: Response) => void)
router.post('/api/generateComponent', generateComponentEndpoint as (req: Request, res: Response) => void)
app.use(router)

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY})

export type Message = {
  role: 'system' | 'user' | 'assistant'
  content: string,
}

function validateReq(req:Request, res:Response) {
  if (!req.is('application/json')) {
    return res.status(400).json({ error: 'Invalid request body' });
  }
  if (!req.body) {
    return res.status(400).json({error: "Prompt is required"});
  }
}

async function generateComponentEndpoint(req: Request, res: Response) {
  validateReq(req, res);
  const body = req.body;
  const component : string = await generateComponent(req.body.agentName, req.body.agentProps, body.agentDescription, body.similarComponents);
  return res.status(200).json(component);
}

async function writeToolNodeEndpoint(req: Request, res: Response) {
  validateReq(req, res);
  const [contextDataJson, toolGraphJson] = await Promise.all([redisClient.get('contextData'), redisClient.get('toolGraph')]);
  const body = req.body;
  const toolNode : OpenAI.ChatCompletionTool = await generateToolNode(body.agentName, body.agentDescription, body.agentArgs, contextDataJson);
  const toolGraph : OpenAI.ChatCompletionTool[] = JSON.parse(toolGraphJson);
  toolGraph.push(toolNode);
  redisClient.set('toolGraph', JSON.stringify(toolGraph));
  return res.status(200).json(toolNode);
}

async function getFunctionCallDecision(req:Request, res:Response) {
  validateReq(req, res);
  const toolGraphJson = await redisClient.get('toolGraph');
  const toolGraph : OpenAI.ChatCompletionTool[] = JSON.parse(toolGraphJson);
  const prompt : Message = {
    role: "user",
    content: req.body.prompt
  }; 
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{
      role: "system",
      content: `You are an agent that determines which function in the tools to call given the user's prompt. Use the entire conversation history for context, but prioritize the last user message for making your decision. If no other function is appropriate, default to calling the "chatAgent" function.`
  }, prompt],
    tools: toolGraph,
  });
  if (!response.choices[0].message.tool_calls) {
    // Default to chat agent if there are no valid function calls. 
    return res.status(200).json({ message: "No valid function calls found" });
  } else {
    const toolCall = response.choices[0].message.tool_calls[0];
    const functionName = toolCall.function.name;
    const args = JSON.parse(toolCall.function.arguments);
    return res.status(200).json({ message: "Function chosen: " + functionName + " with arguments: " + JSON.stringify(args) });
  }
}

async function provideContext(req:Request, res:Response) {
  validateReq(req, res);
  const prompt = req.body;
  const kvObject : Record<string, string[]> = prompt;
  if (!kvObject) {
    return res.status(400).json({error: "Valid kv-pair object is required"});
  }
  redisClient.set('contextData', JSON.stringify(prompt));
  return res.status(200).json({ message: "Context provided successfully" });
}

async function getContext(req:Request, res:Response) {
  const contextData = await redisClient.get('contextData');
  return res.status(200).json(contextData);
}

async function getToolGraph(req:Request, res:Response) {
  const toolGraph = await redisClient.get('toolGraph');
  return res.status(200).json(toolGraph);
}

async function writeToolGraph(req:Request, res:Response) {
  validateReq(req, res);
  const toolSet : OpenAI.ChatCompletionTool[] = req.body;
  redisClient.set("toolGraph", JSON.stringify(toolSet));
  return res.status(200).json({ message: "Tool graph updated successfully" });
}

async function generateAgent(req:Request, res:Response) {
  validateReq(req, res);
  const prompt = req.body;
  const generateComponentPromise = generateComponentFile(prompt.directoryPath, prompt.agentName, prompt.agentProps, prompt.agentDescription,prompt.outputPath);
  const [toolGraphJson, contextDataJson] = await Promise.all([redisClient.get('toolGraph'), redisClient.get('contextData')]);
  const generateToolNodePromise = generateToolNode(prompt.agentName, prompt.agentDescription, prompt.agentArgs, contextDataJson);
  const [_, toolNode] = await Promise.all([generateComponentPromise, generateToolNodePromise]);
  const toolGraph : OpenAI.ChatCompletionTool[] = JSON.parse(toolGraphJson);
  toolGraph.push(toolNode);
  redisClient.set('toolGraph', JSON.stringify(toolGraph));
  redisClient.set(createFileKey(prompt.agentName), prompt.outputPath);
  return res.status(200).json({ message: "File generated successfully" });
}

app.listen(port, () => {
    console.log('API listening on port:', port)
})