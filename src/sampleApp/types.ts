import { z } from "zod";
import { PersonCardProps } from "./generalcards/personcard";
import { GolfTournamentCardProps } from "./golfcards/golftournamentcard";
import { GolfPlayerCardProps } from "./golfcards/golfplayercard";
import { GolfBallCardProps } from "./golfcards/golfballcard";

export type MonitoringGraphProps = {
    handlerName: string;
    inputData: { timestamp: number; qps: number }[];
};
export interface TrafficData {
    timestamp: number; // Unix timestamp in milliseconds
    qps: number;
}  

export type Message = {
    role: 'system' | 'user' | 'assistant'
    content: string,
    personCard ?: PersonCardProps,
    golfPlayerCard ?: GolfPlayerCardProps,
    golfBallCard ?: GolfBallCardProps,
    graph ?: MonitoringGraphProps,
    golfTournamentCard ?: GolfTournamentCardProps,
    jobContent?: Job[],
    cardType ?: 'person' | 'string' | 'graph' | 'player' | 'tournament' | 'job' | 'ball'
}

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

export const GolfBallStructure = z.object({
  name: z.string(),
  summary: z.string(),
  launch: z.string().describe("Launch characteristics of this golf ball."),
  spin: z.string().describe("Spin characteristics of this golf ball"),
  firmness: z.string().describe("Firmness of this golf ball"),
  year_introduced: z.number(),
  players: z.array(z.string()).describe("The players that used this golf ball"),
})

export type CronJobNames = 
  | "SampleJob" 
  | "IndexingPipeline" 
  | "RankSignals" 
  | "BackfillDump" 
  | "ExportSequence";
// Array of all cronJobNames
export const cronJobNamesArray: CronJobNames[] = [
  "SampleJob",
  "IndexingPipeline",
  "RankSignals",
  "BackfillDump",
  "ExportSequence",
];

export type cellNames = "ax" | "bu" | "st" | "si" | "pt" | "ad" | "nm" | "qx" | "yz" | "ym" | "fd"

// Array of all cellNames
export const cellNamesArray: cellNames[] = [
  "ax",
  "bu",
  "st",
  "si",
  "pt",
  "ad",
  "nm",
  "qx",
  "yz",
  "ym",
  "fd",
];

// Define a custom datetime validation
const DateTimeString = z.string().refine(
  (value) => !isNaN(Date.parse(value)), // Checks if the string is a valid date
  {
    message: "Invalid datetime format. Expected an ISO 8601 string.",
  }
);

const FilterJobSchema = z.object({
  field: z.enum([
    "durationMin", "createdAt", "name", "cell", "success", "resourceUsage"
  ]),
  operator: z.enum(["<", ">", "before", "after", "equals", "notEquals"]),
  value: z.union([z.string(), z.boolean(), z.number(), DateTimeString]), // Allow string, boolean, number, or datetime
});

// Define possible sorting fields and orders
const SortJobSchema = z.object({
  field: z.enum(["createdAt", "durationMin", "resourceUsage"]),
  order: z.enum(["asc", "desc"]),
});

// Main query schema that combines filters, sorting, and pagination
export const QueryJobSchema = z.object({
  filters: z.array(FilterJobSchema).optional(),
  sort: SortJobSchema.optional(),
  limit: z.number().int().optional(),
});

export type QueryJob = z.infer<typeof QueryJobSchema>;

export type Job = {
  durationMin: number;
  createdAt: Date;
  name: string;
  cell: string;
  success: boolean;
  resourceUsage: number;
  id: string;
}
