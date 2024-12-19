import { z } from "zod";
import { PersonCardProps } from "./generalcards/personcard";
import { GolfTournamentCardProps } from "./golfcards/golftournamentcard";
import { GolfPlayerCardProps } from "./golfcards/golfplayercard";

export const PersonCardStructure = z.object({
    name: z.string(),
    summary: z.string(),
    birthday: z.string(),
    death: z.string(),
    age: z.number(),
    occupation: z.string().describe("occupation the person is best known for in 5 words or less"),
    almaMater: z.string(),
    hometown: z.string(),
    spouses: z.array(z.string()),
    awards: z.array(z.string()),
    profilePictureUrl: z.string().optional(),
})

export const GolfPlayerCardStructure = z.object({
  name: z.string(),
  height: z.string(),
  birthday: z.string(),
  rank: z.number().describe("Rank the player is in the world according to the Official World Golf Ranking System in the specified year."),
  tour: z.enum(["LIV", "PGA", "LPGA", "DP", "Korn Ferry", "Asia", "Champions"]).describe("The logo of the tour the player played in the specified year. One of LIV Golf, PGA Tour, DP World Tour, Korn Ferry Tour, Asia Tour, LPGA tour, PGA Tour Champions, etc. If the player moved from PGA to LIV, please default to LIV. See the LIV golf roster from livgolf.com/player, for the current PGA Tour roster, see pgatour.com/players, for Korn Ferry, see pgatour.com/korn-ferry-tour/players"),
  almaMater: z.string(),
  hometown: z.string(),
  firstWin: z.string().describe("the first LIV, DP World Tour, or PGA Tour tournament win the player won. Please include the year of the tournament as well."),
  recentWin: z.string().describe("the most recent LIV, DP World Tour, or PGA Tour tournament win the player won up to the specified year. Please include the year of the tournament as well.").optional(),
  sponsor: z.enum(["TaylorMade", "Titleist", "Callaway", "Ping", "Mizuno", "Srixon", "Wilson", "PXG", "Nike", "Adams"]).optional().describe("Information can be from pgaclubtracker.com, GolfWRX, or other websites. Sponsor should be the sponsor from that year."),
  clubs: z.array(z.string()).describe("List of clubs the player used that year. Please do not include information about the shaft or grip. Just the club head. Clubs should be the clubs the player used in the specified year."),
  ball: z.string().describe("The ball the player used that year, for example, Titleist Pro V1, Taylormade TP5x, etc.").optional(),
})

const PlayerScore = z.object({
  name: z.string(),
  roundScores: z.array(z.string()).describe("The scores for each round, 3 rounds for LIV or 4 rounds for other tournaments. Please also show the scores relative to par. For example, 68 (-4), when the par is 72. "),
  finalScore: z.string().describe("The final score for the tournament. For example, 68 (-4), when the par is 72. This should be the cumulative total of round scores."),
  prizeMoney: z.number().describe("The prize money the player won for their position in the standings."),
  position: z.string().describe("The position of the player in the tournament. For example, 1 for first, 2 for second, T2 if there was a tie for 2nd.")
})

export type PlayerScoreType = z.infer<typeof PlayerScore>;

export const GolfTournamentCardStructure = z.object({
  name: z.string(),
  location: z.string(),
  course: z.string(),
  summary: z.string(),
  dates: z.string().describe("The dates of the tournament. for example, Dec 5-8, 2023"),
  weather: z.string(),
  purse: z.number(),
  players: z.array(PlayerScore).describe("The top 10 players from the tournament."),
  year: z.number(),
})

// Define base parameter types
const baseType = z.union([
  z.literal("string"),
  z.literal("number"),
  z.literal("boolean"),
  z.literal("array"),
  z.literal("object"),
]);

const parametersSchema = z.object({
  type: z.literal("object").describe("Defines the structure of the parameters."),
  // TODO: issue is with z.record..., skip trying to make it recursive for now.
  properties: z.record(z.string(),
    z.object({
      type: z.union([
        z.literal("string"),
        z.literal("number"),
        z.literal("boolean"),
        z.literal("array"),
        //z.literal("object"),
      ]),
      description: z.string().optional(),
      //items: z.lazy(() => parametersSchema.optional()).optional(), // For arrays or nested objects
      //properties: z.lazy(() => z.record(parametersSchema).optional()), // Nested properties
      //required: z.array(z.string()).optional(), // Required keys for nested properties
    })
  ),
  required: z
    .array(z.string())
    .describe("List of required parameter names."),
});

export const ChatCompletionToolSchema = z.object({
  name: z.string().describe("The name of the function to be called. Must be a-z, A-Z, 0-9, or contain underscores and dashes, with a maximum length of 64."),
  description: z.string().describe("A description of what the function does, used by the model to choose when and how to call the function."),
  parameters: parametersSchema.describe("The parameters the functions accepts, described as a JSON Schema object. See the guide](https://platform.openai.com/docs/guides/function-calling) for examples," +
   "and the [JSON Schema reference](https://json-schema.org/understanding-json-schema/) for documentation about the format. Omitting `parameters` defines a function with an empty parameter list."),
  strict: z.boolean().describe("Whether to enable strict schema adherence when generating the function call. If" +
   "set to true, the model will follow the exact schema defined in the `parameters` field. Only a subset of JSON Schema is supported when `strict` is `true`. Learn" +
   "more about Structured Outputs in the [function calling guide](docs/guides/function-calling).")
});

export interface TrafficData {
  timestamp: number; // Unix timestamp in milliseconds
  qps: number;
}

export type MonitoringGraphProps = {
  handlerName: string;
  inputData: { timestamp: number; qps: number }[];
};

export type Message = {
    role: 'system' | 'user' | 'assistant'
    content: string,
    personCard ?: PersonCardProps,
    golfPlayerCard ?: GolfPlayerCardProps,
    graph ?: MonitoringGraphProps,
    golfTournamentCard ?: GolfTournamentCardProps,
    cardType ?: 'person' | 'string' | 'graph' | 'player' | 'tournament'
}
