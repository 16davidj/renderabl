import { z } from "zod";

export const PersonCardStructure = z.object({
    name: z.string(),
    summary: z.string(),
    birthday: z.string(),
    death: z.string(),
    age: z.number(),
    occupation_best_known_for_five_or_less_words: z.string(),
    alma_mater: z.string(),
    hometown: z.string(),
    spouses: z.array(z.string()),
    awards: z.array(z.string())
  })

export type Message = {
    role: 'system' | 'user' | 'assistant'
    content: string,
    card : typeof PersonCardStructure,
    renderCard : boolean,
}
