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

export const CombinedCardStructure = z.object({
  type: z.enum(["person", "string"]), // A "discriminator" field
  data: z.union([PersonCardStructure, StringStructure]),
});

export type CombinedCard = z.infer<typeof CombinedCardStructure>;
export type StringCard = z.infer<typeof StringStructure>;

export type Message = {
    role: 'system' | 'user' | 'assistant'
    content: string,
    card : typeof PersonCardStructure,
    renderCard : 'person' | 'string'
}
