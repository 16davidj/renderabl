import express, {Request, Response} from 'express';
import {OpenAI} from 'openai'
import {GolfPlayerCardStructure, GolfTournamentCardProps, GolfPlayerCardProps, Message, GolfTournamentCardStructure, PersonCardProps, PersonCardStructure} from './types'
import { zodResponseFormat } from "openai/helpers/zod";
import cors from 'cors'
import dotenv from 'dotenv'
import { getTrafficData } from './fakedb';

const app = express();
const port = process.env.REACT_APP_PORT || 5500;
dotenv.config();

app.use(express.json())
app.use(cors({origin: '*'}))
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // Or specify allowed origins
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
  });

const router = express.Router();
router.post('/api/openai', postCall as (req: Request, res: Response) => void);
app.use(router)

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY})

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
  {
    type: "function",
    function: {
      name: "monitoringGraphAgent",
      description: "Get monitoring graph data. Call whenever you need to respond to a prompt that asks for monitoring graph data of a handler.",
      parameters: {
        type: "object",
        properties: {
          handlerName: { type: "string", description: "The name of the handler to get monitoring graph data on." },
        },
        required: ["handlerName"],
      },
    }
  },
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

// Use Structured Outputs and fake API calls to simulate agent.
async function personAgent(person : string): Promise<Message> {
    let res:Response
    try {
      const prompt : Message = { role: "user", content: person }
      const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{
              role: "system",
              content: "You are a helpful assistant that gathers information about a particular person."
          }, prompt],
          response_format: zodResponseFormat(PersonCardStructure, "person_card_structure"),
        })
        const result = response.choices[0].message.content;
        const parsedOutput : PersonCardProps = JSON.parse(result);
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

async function getPictureUrl(topic : string, ratio: number, size?: "medium" | "large"
) : Promise<string> {
  try {
    const CX = '70fc0f5d68c984853';
    const FILE_TYPE = 'jpg';
    const googleApiUrl = `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_API_KEY}&cx=${CX}&q=${topic}&searchType=image&num=5&fileType=${FILE_TYPE}`;
    if (size) {
      const googleApiUrl = `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_API_KEY}&cx=${CX}&q=${topic}&searchType=image&num=5&fileType=${FILE_TYPE}&imgSize=${size}`;
    }
    // Use fetch to call the Google API
    const response = await fetch(googleApiUrl);
    if (!response.ok) {
      throw new Error(`Google API error: ${response.statusText}`);
    }
    const data = await response.json();
    console.log(topic)
    for (const item of data.items) {
      if (item.link && item.image.width > 0 && item.image.height > 0) {
        console.log(item.link)
        const aspectRatio = item.image.width / item.image.height;
        if (aspectRatio >= ratio) {
          return item.link
        }
      }
    }
  } catch (error) {
    console.error('Error fetching data from Google API:', error);
    return "";
  }
}

async function getYouTubeVodId(query : string) : Promise<string> {
  try {
    const youtubeApiUrl = `https://www.googleapis.com/youtube/v3/search?key=${process.env.GOOGLE_API_KEY}&part=snippet&q=${query}&maxResults=5`;
    const response = await fetch(youtubeApiUrl);
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.statusText}`);
    }
    const data = await response.json();
    for (const item of data.items) {
      if (item.id && item.id.videoId) {
        return item.id.videoId;
      }
    }
  } catch (error) {
    console.error('Error fetching data from Google API:', error);
    return "";
  }
}

// Use Structured Outputs and fake API calls to simulate golf player agent.
export async function golfPlayerAgent(player : string, year? : number): Promise<Message> {
  let res:Response
  try {
    if (!year) {
      year = new Date().getFullYear();
    }
    const playerInYear = player + " in " + year;
    const prompt : Message = { role: "user", content: playerInYear };
    const responsePromise = openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{
            role: "system",
            content: "You are a helpful assistant that gathers information about a golf player in a specific year. If the year is not specified, get information up to the current year. If the year is specified, only get information that was available up to that year."
        }, prompt],
        response_format: zodResponseFormat(GolfPlayerCardStructure, "golf_player_card_structure"),
      })
      const pictureUrlPromise = getPictureUrl(playerInYear, 1.0);
      const [response, profilePictureUrl] = await Promise.all([responsePromise, pictureUrlPromise]);

      const result = response.choices[0].message.content;
      const parsedOutput : GolfPlayerCardProps = JSON.parse(result);
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
      return messageResponse;
    } catch (error) {
      console.error('Error from OpenAI:', error)
    }
}

// Use Structured Outputs and fake API calls to simulate golf player agent.
export async function golfTournamentAgent(tournament : string, year : number): Promise<Message> {
  let res:Response
  try {
    const prompt : Message = { role: "user", content: tournament + " golf tournament " + "in " + year };
    const responsePromise = openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{
            role: "system",
            content: "You are a helpful assistant that gathers information about a golf tournament from a certain year."
        }, prompt],
        response_format: zodResponseFormat(GolfTournamentCardStructure, "golf_tournament_card_structure"),
      })
    const coursePicturePromise = getPictureUrl(tournament + " " + year + " golf tournament", 0.9);
    const videoPromise = getYouTubeVodId(tournament + " " + year + " golf tournament highlights");
    const [response, coursePictureUrl, yt_highlights_id] = await Promise.all([responsePromise, coursePicturePromise, videoPromise]);

    const result = response.choices[0].message.content;
    const parsedOutput : GolfTournamentCardProps = JSON.parse(result);
    parsedOutput.course_picture_url = coursePictureUrl;
    console.log(yt_highlights_id)
    parsedOutput.yt_highlights_id = yt_highlights_id;
    // TODO: make call to YouTube to get highlights to video
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
async function chatAgent(prompt : Message[]) : Promise<Message> {
  let res:Response
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


function monitoringGraphAgent(handlerName : string) : Message {
  const response : Message = {
    role: "system",
    content: "chat response with monitoring graph data to render.",
    graph: { handlerName: handlerName, inputData: getTrafficData(handlerName)},
    cardType: "graph"
  }
  return response
}

async function agentDeciderAndRunner(responseString : string) : Promise<Message> {
  const response = JSON.parse(responseString);
  const toolCall = response.choices[0].message.tool_calls[0];
  const functionName = toolCall.function.name;
  const args = JSON.parse(toolCall.function.arguments);
  switch (functionName) {
    case "chatAgent":
      return chatAgent(args.messages);
    // case "personAgent":
    //   return personAgent(args.person);
    case "monitoringGraphAgent":
      return monitoringGraphAgent(args.handlerName);
    case "golfPlayerAgent":
      if (args.year) {
        return golfPlayerAgent(args.player, args.year);
      }
      return golfPlayerAgent(args.player);
    case "golfTournamentAgent":
      return golfTournamentAgent(args.tournament, args.year);
  } 
}

async function postCall(req:Request, res:Response) {
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

app.listen(port, () => {
    console.log('API listening on port:', port)
})