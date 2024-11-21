import express, {Request, Response} from 'express';
import {OpenAI} from 'openai'
import {Message, PersonCardStructure} from './types'
import { zodResponseFormat } from "openai/helpers/zod";
import cors from 'cors'

const app = express();
const port = process.env.PORT || 5500;

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
const openai = new OpenAI({apiKey: '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'})

// TODO: function calling
// const tools = [
//     {
//         type: "function",
//         function: {
//             name: "personStructureOutput",
//             description: "Makes a call to OpenAI chat completion whenever the prompt asks about who someone is. Call this whenever the prompt resembles: 'Who is [person name]'",
//             parameters: {
//                 type: "object",
//                 properties: {
//                     order_id: {
//                         type: "string",
//                         description: "The customer's order ID.",
//                     },
//                 },
//                 required: ["order_id"],
//                 additionalProperties: false,
//             },
//         },
//     },
// ];

async function personStructureOutput(prompt: Message[]): Promise<typeof PersonCardStructure> {
    let res:Response
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{
                role: "system",
                content: "You are a helpful assistant as a chatbot, responding to user input."
            }, ...prompt],
            response_format: zodResponseFormat(PersonCardStructure, "person_card_structure")
          })
          const result = response.choices[0].message.content;
          const parsedOutput : typeof PersonCardStructure = JSON.parse(result)
          return parsedOutput
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