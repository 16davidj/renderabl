import express, {Request, Response} from 'express';
import {OpenAI} from 'openai'
import {Message, PersonCardStructure, CombinedCardStructure} from './types'
import { zodResponseFormat } from "openai/helpers/zod";
import cors from 'cors'
import {PersonCardProps} from './personcard'
import dotenv from 'dotenv'

// Fake DB. Assume that this would be a network call in a real product
const imageMap = new Map<string, string>([
  ["Nelson Mandela", "https://hips.hearstapps.com/hmg-prod/images/_photo-by-per-anders-petterssongetty-images.jpg?crop=1.00xw:1.00xh;0,0&resize=1200:*"],
  ["Gordon Ramsay", "https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/319794_v9_bb.jpg"],
  ["Simone Biles", "https://img.olympics.com/images/image/private/t_1-1_300/f_auto/primary/bpg1hewhmku06znwbbnk"]
]);

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
          response_format: zodResponseFormat(CombinedCardStructure, "combined_structure"),
        })
        const result = response.choices[0].message.content;
        const parsedOutput = JSON.parse(result);
        if (parsedOutput.type === "person" && parsedOutput.data.name) {
          // This would be an internal call in the companies API
          parsedOutput.data.profilePictureUrl = imageMap.get(parsedOutput.data.name);
        }
        return parsedOutput;
      } catch (error) {
        console.error('Error from OpenAI:', error)
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
    const output = await personStructureOutput(prompt)
    return res.status(200).json(output);
}

app.listen(port, () => {
    console.log('API listening on port:', port)
})