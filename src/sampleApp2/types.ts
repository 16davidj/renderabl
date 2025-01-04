import { z } from "zod";

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

export type Message = {
  role: 'system' | 'user' | 'assistant'
  content: string,
  jobContent?: Job[],
  cardType ?: 'person' | 'string' | 'job'
}

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
