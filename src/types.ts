import { z } from "zod";


export const PersonCardStructure = z.object({
    name: z.string(),
    summary: z.string(),
    birthday: z.string(),
    death: z.string(),
    age: z.number(),
    occupation: z.string().describe("occupation the person is best known for in 5 words or less"),
    alma_mater: z.string(),
    hometown: z.string(),
    spouses: z.array(z.string()),
    awards: z.array(z.string()),
    profilePictureUrl: z.string().optional(),
  })

export const StringStructure = z.object({
  chat_response: z.string().describe("response from the LLM")
})

export type Message = {
    role: 'system' | 'user' | 'assistant'
    content: string,
    card : typeof PersonCardStructure,
    renderCard : boolean,
}
