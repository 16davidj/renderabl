import express, {Request, Response} from 'express';
import {OpenAI} from 'openai'
import {Message, StructuredCard, HandlerPerformanceMap, MonitoringGraphProps, PersonCardProps, CombinedCard} from './types'
import { zodResponseFormat } from "openai/helpers/zod";
import cors from 'cors'
import dotenv from 'dotenv'
import { getProfilePicture, getTrafficData } from './fakedb';

const app = express();
const port = process.env.PORT || 5500;
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

// TODO: interface this function by type instead of doing function calling
async function personStructureOutput(prompt: Message[]): Promise<PersonCardProps> {
    let res:Response
    try {
      const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{
              role: "system",
              content: "You are a helpful assistant. Please only evaluate the last message by the user in this list."
          }, ...prompt],
          response_format: zodResponseFormat(StructuredCard, "combined_structure"),
        })
        const result = response.choices[0].message.content;
        const parsedOutput = JSON.parse(result);
        if (parsedOutput.type === "person" && parsedOutput.data.profilePictureUrl) {
          // This would be an internal call in the companies API
          parsedOutput.data.profilePictureUrl = getProfilePicture(parsedOutput.data.name);
        }
        return parsedOutput;
      } catch (error) {
        console.error('Error from OpenAI:', error)
      }
}

function monitoringGraphOutput() : MonitoringGraphProps {
  return { handlerName: "GetSampleHandler", inputData: getTrafficData("GetSampleHandler")};
}

async function postCall(req:Request, res:Response) {
    const prompt : Message[] = req.body.messages;
    if (!req.is('application/json')) {
        return res.status(400).json({ error: 'Invalid request body' });
    }
    if (!prompt) {
      return res.status(400).json({error: "Prompt is required"});
    }
    const output = await personStructureOutput(prompt)
    //const output = monitoringGraphOutput();

    return res.status(200).json(output);
}

app.listen(port, () => {
    console.log('API listening on port:', port)
})