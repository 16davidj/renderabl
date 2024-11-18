import express, {Request, Response} from 'express';
import {OpenAI} from 'openai';
import {Message} from './types'

const app = express();
const port = process.env.PORT || 5000;

console.log("starting backend server")

app.use(express.json())

const openai = new OpenAI({apiKey: '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'})

async function postCall(req:Request, res:Response) {
    const prompt : Message[] = req.body;
    if (!prompt) {
      return res.status(400).json({error: "Prompt is required"});
    }
    try {
      const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [{
              role: "system",
              content: "You are a helpful assistant as a chatbot, responding to user input."
          }, ...prompt.map<{
              role: "system" | "assistant" | "user"
              content: string
          }>(message=> ({
              role: message.sender,
              content: message.text
          }))]
        })

        console.log(response)
        const result = response.choices[0].message.content;

        return res.status(200).json({body: result})
    } catch {
      return res.status(500).json({error: "Call to OpenAI failed."})
    }
}
const router = express.Router();
router.post('api/openai', postCall as (req: Request, res: Response) => void);
app.use(router)

app.listen(port, () => {
    console.log('API listening on port:${port}')
})