import express, {Request, Response} from 'express';
import {OpenAI} from 'openai'
import { GolfPlayerCardStructure, Message, GolfTournamentCardStructure, PersonCardStructure} from '../types'
import { GolfPlayerCardProps } from '../golfcards/golfplayercard';
import { GolfTournamentCardProps } from '../golfcards/golftournamentcard';
import { PersonCardProps } from '../generalcards/personcard';
import { zodResponseFormat } from "openai/helpers/zod";
import cors from 'cors'
import dotenv from 'dotenv'
import { generateComponentFile, generateToolNode, mutateComponentFile } from '../renderableFe/renderableFeUtils';
import { connectRedis, redisClient } from '../redis/redisClient';
import { createFileKey, createSponsorLogoKey, createTourLogoKey } from '../redis/redisUtils';
import { ZodType, ZodTypeDef } from "zod";
import { getPictureUrl, getYouTubeVodId } from './apiutils';

const tools: OpenAI.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "chatAgent",
      description: "Default to this whenever the other tools, such as personAgent, are not appropriate. Do not respond to the chat message itself.",
      parameters: {
        type: "object",
        properties: {
          messages: {
            type: "array",
            items: {
              type: "object",
              properties: {
                role: { type: "string", enum: ["system", "user", "assistant"], description: "The role of the sender of the chat message" },
                content: { type: "string", description: "The content of the chat message" },
              },
              required: ["role", "content"],
            },
          },
        },
        required: ["messages"],
      },
    }
  },
  // {
  //   type: "function",
  //   function: {
  //     name: "personAgent",
  //     description: "Get information about a person. Call whenever you need to respond to a prompt that asks about a person.",
  //     parameters: {
  //       type: "object",
  //       properties: {
  //         person: { type: "string", description: "The name of the person to get information on." },
  //       },
  //       required: ["person"],
  //     },
  //   }
  // },
  // {
  //   type: "function",
  //   function: {
  //     name: "monitoringGraphAgent",
  //     description: "Get monitoring graph data. Call whenever you need to respond to a prompt that asks for monitoring graph data of a handler.",
  //     parameters: {
  //       type: "object",
  //       properties: {
  //         handlerName: { type: "string", description: "The name of the handler to get monitoring graph data on." },
  //       },
  //       required: ["handlerName"],
  //     },
  //   }
  // },
  {
    type: "function",
    function: {
      name: "golfPlayerAgent",
      description: "Get information about a golf player. Call whenever you need to respond to a prompt that asks about a golf player, and maybe from a specific year.",
      parameters: {
        type: "object",
        properties: {
          player: { type: "string", description: "The name of the golf player to get information on." },
          year: {type: "number", description: "The year to get information about the golf player. If not specified, get the current year information."}
        },
        required: ["player"],
      },
    }
  },
  {
    type: "function",
    function: {
      name: "golfTournamentAgent",
      description: "Get information about a golf tournament results from a specific year. Call whenever you need to respond to a prompt that asks about a golf tournament.",
      parameters: {
        type: "object",
        properties: {
          tournament: { type: "string", description: "The name of the golf tournament to get information on." },
          year: {type: "number", description: "The year to get information about the golf tournament."}
        },
        required: ["tournament", "year"],
      },
    }
  }
];

const preWarmRedis = async () => {
  try {
    // Example: Preload some key-value pairs necessary to render logos.
    const data = [
      { key: 'tourlogo:LIV', value: 'https://i0.wp.com/golfblogger.com/wp-content/uploads/2022/05/liv-golf-logo.png?ssl=1' },
      { key: 'tourlogo:PGA', value: 'https://upload.wikimedia.org/wikipedia/en/thumb/7/77/PGA_Tour_logo.svg/1200px-PGA_Tour_logo.svg.png' },
      { key: 'tourlogo:DP', value: 'https://sportspro.com/wp-content/uploads/2023/03/DP-World-Tour-Logo.png' },
      { key: 'tourlogo:LPGA', value: 'https://cdn.cookielaw.org/logos/9c8a7e84-2713-496b-bb8b-4ab1c7aa9853/01917b66-958c-71d8-80e3-efefcbc9cdc9/9ed04020-943b-462b-ac02-b19496f9ce72/BRD23_LOGO_-_FLAT_RGB_VERT_(1).png' },
      { key: 'tourlogo:Champions', value: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/fe/PGA_Tour_Champions_logo.svg/640px-PGA_Tour_Champions_logo.svg.png' },
      { key: 'sponsorlogo:TaylorMade', value: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/TaylorMade.svg' },
      { key: 'sponsorlogo:Titleist', value: 'https://upload.wikimedia.org/wikipedia/commons/d/d6/Titleist_golf_logo.png' },
      { key: 'sponsorlogo:Callaway', value: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Callaway_Golf_Company_logo.svg/2560px-Callaway_Golf_Company_logo.svg.png' },
      { key: 'sponsorlogo:Ping', value: 'https://upload.wikimedia.org/wikipedia/commons/3/37/Ping-logo.png' },
      { key: 'sponsorlogo:Mizuno', value: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/MIZUNO_logo.svg/2560px-MIZUNO_logo.svg.png' },
      { key: 'sponsorlogo:Srixon', value: 'https://upload.wikimedia.org/wikipedia/commons/f/f5/Srixon_golf_logo.PNG' },
      { key: 'sponsorlogo:Wilson', value: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Wilson-logo.svg/1024px-Wilson-logo.svg.png' },
      { key: 'sponsorlogo:PXG', value: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/PXG_Logo.svg/1280px-PXG_Logo.svg.png' },
      { key: 'sponsorlogo:Nike', value: 'https://logos-world.net/wp-content/uploads/2020/04/Nike-Logo.png' },
      { key: 'sponsorlogo:Adams', value: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Adams_golf_brand_logo.png' },
      { key: 'toolGraph', value: JSON.stringify(tools)}
    ];

    for (const { key, value } of data) {
      await redisClient.set(key, value);
    }
    console.log('Redis pre-warmed with initial data');
  } catch (error) {
    console.error('Error pre-warming Redis:', error);
  }
};

const app = express();
const port = process.env.REACT_APP_PORT;
dotenv.config();

app.use(express.json())
app.use(cors({origin: '*'}))
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
  });

connectRedis();
preWarmRedis();

// Endpoint to set a key-value pair, if the value is complex (use this for the decider graph).
app.post('/api/redis', async (req, res) => {
  const { key, value } = req.body;
  try {
    await redisClient.set(key, JSON.stringify(value)); // Serialize complex objects
    res.status(200).send({ message: 'Key-Value pair saved to Redis' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Error saving data to Redis' });
  }
});

// Endpoint to get a value by key
app.get('/api/redis/:key', async (req, res) => {
  const { key } = req.params;
  try {
    const value = await redisClient.get(key);
    res.status(200).send({ key, value: value ? JSON.parse(value) : null });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Error retrieving data from Redis' });
  }
});

const router = express.Router();
router.post('/api/renderabl', renderableBe as (req: Request, res: Response) => void);
router.post('/api/generateRenderabl', generateComponent as (req: Request, res: Response) => void)
router.post('/api/mutateRenderabl', mutateComponent as (req: Request, res: Response) => void)

app.use(router)

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY})

async function genericAgent<T extends ZodType<any, ZodTypeDef, any>>(
  prompt : Message,
  structure: T,
  systemMessage: string
): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: systemMessage,
      },
      prompt
    ],
    response_format: zodResponseFormat(structure, "agent structure"),
  });
  return response.choices[0].message.content;
}

// Use Structured Outputs and fake API calls to simulate agent.
async function personAgent(person : string): Promise<Message> {
    try {
      const prompt : Message = { role: "user", content: person }
      const result = await genericAgent(prompt, PersonCardStructure, "You are a helpful assistant that gathers information about a particular person.");
      const parsedOutput : PersonCardProps = JSON.parse(result);
      // Client API calls for agent specific features not available to LLM.
      if (parsedOutput.name) {
        parsedOutput.profilePictureUrl = await getPictureUrl(parsedOutput.name, 1.0);
      }
      const messageResponse : Message = {
        role: "system",
        content: "chat response with a UI card about the person.",
        personCard: parsedOutput,
        cardType: "person"
      }
      return messageResponse;
    } catch (error) {
      console.error('Error from OpenAI:', error)
    }
}

// Use Structured Outputs and fake API calls to simulate golf player agent.
export async function golfPlayerAgent(args): Promise<Message> {
  const player : string = args.player;
  let year : number = args.year;
  if (!player) {
    console.error("Player name is required");
    return;
  }
  if (!year) {
    year = new Date().getFullYear();
  }
  try {
    const agentDescription : string = "You are a helpful assistant that gathers information about a particular golf player in a specific year. If the year is not specified, get information up to the current year. If the year is specified, only get information that was available up to that year."; 
    const promptContent = player + ", " + year;
    const prompt : Message = { role: "user", content: promptContent };
    const [response, profilePictureUrl] = await Promise.all([genericAgent(prompt, GolfPlayerCardStructure, agentDescription), getPictureUrl(promptContent, 1.0)]);

    const parsedOutput : GolfPlayerCardProps = JSON.parse(response);
    parsedOutput.profilePictureUrl = profilePictureUrl;
    if (year != new Date().getFullYear()) {
      parsedOutput.year = year;
    }
    const messageResponse : Message = {
      role: "system",
      content: "chat response with a UI card about the golf player.",
      golfPlayerCard: parsedOutput,
      cardType: "player"
    }
    // Get Sponsor and Tour logos from Redis.
    const [sponsorLogoUrl, tourLogoUrl] = await Promise.all([
      redisClient.get(createSponsorLogoKey(parsedOutput.sponsor)),
      redisClient.get(createTourLogoKey(parsedOutput.tour))
    ])
    parsedOutput.sponsorLogoUrl = sponsorLogoUrl;
    parsedOutput.tourLogoUrl = tourLogoUrl;

    return messageResponse;
  } catch (error) {
    console.error('Error from OpenAI:', error)
  }
}

// Use Structured Outputs and fake API calls to simulate golf player agent.
export async function golfTournamentAgent(args): Promise<Message> {
  const tournament : string = args.tournament;
  const year : number = args.year;
  
  if(!tournament) {
    console.error("Tournament name is required");
    return;
  }

  try {
    const agentDescription : string = "You are a helpful assistant that gathers information about a golf tournament in a specific year. If the year is not specified, get information from the most recent tournament.";
    const promptContent = tournament + "golf tournament in " + year;
    const prompt : Message = { role: "user", content: promptContent };
    const [response, coursePictureUrl, ytHighlightsId] = await Promise.all([genericAgent(
        prompt, GolfTournamentCardStructure, agentDescription),
        getPictureUrl(promptContent, 0.9), getYouTubeVodId(promptContent + " highlights")
      ]);
    const parsedOutput : GolfTournamentCardProps = JSON.parse(response);
    parsedOutput.coursePictureUrl = coursePictureUrl;
    parsedOutput.ytHighlightsId = ytHighlightsId;
    const messageResponse : Message = {
      role: "system",
      content: "chat response with a UI card about the golf tournament.",
      golfTournamentCard: parsedOutput,
      cardType: "tournament"
    }
    return messageResponse;
    } catch (error) {
      console.error('Error from OpenAI:', error)
    }
}

// Generic chat response agent.
async function chatAgent(args) : Promise<Message> {
  const prompt : Message[] = args.messages;
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

// function monitoringGraphAgent(handlerName : string) : Message {
//   const response : Message = {
//     role: "system",
//     content: "chat response with monitoring graph data to render.",
//     graph: { handlerName: handlerName, inputData: getTrafficData(handlerName)},
//     cardType: "graph"
//   }
//   return response
// }

async function agentDeciderAndRunner(responseString : string) : Promise<Message> {
  const response = JSON.parse(responseString);
  const toolCall = response.choices[0].message.tool_calls[0];
  const functionName = toolCall.function.name;
  const args = JSON.parse(toolCall.function.arguments);
  switch (functionName) {
    case "chatAgent":
      return chatAgent(args);
    // case "personAgent":
    //   return personAgent(args.person);
    // case "monitoringGraphAgent":
    //   return monitoringGraphAgent(args.handlerName);
    case "golfPlayerAgent":
      return golfPlayerAgent(args); 
    case "golfTournamentAgent":
      return golfTournamentAgent(args);
  } 
}

async function renderableBe(req:Request, res:Response) {
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
      content: "You are an agent that determines what function in the tools to call given the user prompt. You can use the entire messages array as context, but please only respond to the last message."
  }, ...prompt],
    tools: tools,
  });
  const messageResponse : Message = await agentDeciderAndRunner(JSON.stringify(functionCallResponse))
  return res.status(200).json(messageResponse);
}

async function generateComponent(req:Request, res:Response) {
  const prompt = req.body;
  if (!req.is('application/json')) {
      return res.status(400).json({ error: 'Invalid request body' });
  }
  if (!prompt) {
    return res.status(400).json({error: "Prompt is required"});
  }
  const generateComponentPromise = generateComponentFile(prompt.directoryPath, prompt.agentName, prompt.agentProps, prompt.agentDescription, prompt.outputPath);
  const toolGraphJson = await redisClient.get('toolGraph');
  const generateToolNodePromise = generateToolNode(prompt.agentName, prompt.agentDescription, await redisClient.get('toolGraph'));
  const [_, toolNode] = await Promise.all([generateComponentPromise, generateToolNodePromise]);
  const toolGraph : OpenAI.ChatCompletionTool[] = JSON.parse(toolGraphJson);
  toolGraph.push(toolNode);
  redisClient.set('toolGraph', JSON.stringify(toolGraph));
  // TODO(davidjin): consider writing file content instead of output path
  redisClient.set(createFileKey(prompt.agentName), prompt.outputPath);
  return res.status(200)
}

async function mutateComponent(req:Request, res:Response) {
  const prompt = req.body;
  if (!req.is('application/json')) {
      return res.status(400).json({ error: 'Invalid request body' });
  }
  if (!prompt) {
    return res.status(400).json({error: "Prompt is required"});
  }
  const fileLocation = await redisClient.get(createFileKey(prompt.agentName));
  if (!fileLocation) {
    return res.status(400).json({error: "File location not found"});
  }
  mutateComponentFile(fileLocation, prompt.agentName, prompt.mutation);
  return res.status(200)
}

app.listen(port, () => {
    console.log('API listening on port:', port)
})