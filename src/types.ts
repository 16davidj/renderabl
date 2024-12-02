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
    graph ?: MonitoringGraphProps,
    cardType ?: 'person' | 'string' | 'graph'
}
