import { z } from "zod";

export type PersonCardProps = {
  name: string;
  summary: string;
  birthday: string;
  death?: string;
  age: number;
  occupation: string;
  alma_mater: string;
  hometown: string;
  spouses?: string[];
  awards?: string[];
  profilePictureUrl?: string;
};

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

export type GolfPlayerCardProps = {
  name: string;
  height: string;
  birthday: string;
  age: number;
  rank: number;
  tour: "LIV" | "PGA" | "DP" | "Korn Ferry" | "Asia" | "LPGA" | "Champions";
  alma_mater: string;
  hometown: string;
  recent_win?: string;
  profilePictureUrl?: string;
  sponsor?: string;
  clubs: string[];
  ball: string;
};

export const GolfPlayerCardStructure = z.object({
  name: z.string(),
  height: z.string(),
  birthday: z.string(),
  age: z.number(),
  rank: z.number().describe("Rank the player is in the world according to the Official World Golf Ranking System."),
  tour: z.enum(["LIV", "PGA", "LPGA", "DP", "Korn Ferry", "Asia", "Champions"]).describe("The logo of the tour the player most recently played in. One of LIV Golf, PGA Tour, DP World Tour, Korn Ferry Tour, Asia Tour, LPGA tour, PGA Tour Champions, etc. If the player moved from PGA to LIV, please default to LIV. See the LIV golf roster from livgolf.com/player, for the current PGA Tour roster, see pgatour.com/players, for Korn Ferry, see pgatour.com/korn-ferry-tour/players"),
  alma_mater: z.string(),
  hometown: z.string(),
  recent_win: z.string().describe("the most recent LIV, DP World Tour, or PGA Tour tournament win. Please include the year of the tournament as well.").optional(),
  profilePictureUrl: z.string().optional(),
  sponsor: z.enum(["TaylorMade", "Titleist", "Callaway", "Ping", "Mizuno", "Srixon", "Wilson", "PXG"]).optional().describe("Please get your information from pgaclubtracker.com"),
  clubs: z.array(z.string()).describe("List of clubs the player is most recently used. Please include the shaft specs if possible."),
  ball: z.string().describe("The ball the player most recently used, for example, Titleist Pro V1, Taylormade TP5x, etc.").optional(),
})

export interface TrafficData {
  timestamp: number; // Unix timestamp in milliseconds
  qps: number;
}

export type HandlerPerformanceMap = Map<string, TrafficData[]>;

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
    cardType ?: 'person' | 'string' | 'graph' | 'player'
}
