"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatCompletionToolSchema = exports.GolfTournamentCardStructure = exports.GolfPlayerCardStructure = exports.PersonCardStructure = void 0;
const zod_1 = require("zod");
exports.PersonCardStructure = zod_1.z.object({
    name: zod_1.z.string(),
    summary: zod_1.z.string(),
    birthday: zod_1.z.string(),
    death: zod_1.z.string(),
    age: zod_1.z.number(),
    occupation: zod_1.z.string().describe("occupation the person is best known for in 5 words or less"),
    almaMater: zod_1.z.string(),
    hometown: zod_1.z.string(),
    spouses: zod_1.z.array(zod_1.z.string()),
    awards: zod_1.z.array(zod_1.z.string()),
    profilePictureUrl: zod_1.z.string().optional(),
});
exports.GolfPlayerCardStructure = zod_1.z.object({
    name: zod_1.z.string(),
    height: zod_1.z.string(),
    birthday: zod_1.z.string(),
    rank: zod_1.z.number().describe("Rank the player is in the world according to the Official World Golf Ranking System in the specified year."),
    tour: zod_1.z.enum(["LIV", "PGA", "LPGA", "DP", "Korn Ferry", "Asia", "Champions"]).describe("The logo of the tour the player played in the specified year. One of LIV Golf, PGA Tour, DP World Tour, Korn Ferry Tour, Asia Tour, LPGA tour, PGA Tour Champions, etc. If the player moved from PGA to LIV, please default to LIV. See the LIV golf roster from livgolf.com/player, for the current PGA Tour roster, see pgatour.com/players, for Korn Ferry, see pgatour.com/korn-ferry-tour/players"),
    almaMater: zod_1.z.string(),
    hometown: zod_1.z.string(),
    firstWin: zod_1.z.string().describe("the first LIV, DP World Tour, or PGA Tour tournament win the player won. Please include the year of the tournament as well."),
    recentWin: zod_1.z.string().describe("the most recent LIV, DP World Tour, or PGA Tour tournament win the player won up to the specified year. Please include the year of the tournament as well.").optional(),
    sponsor: zod_1.z.enum(["TaylorMade", "Titleist", "Callaway", "Ping", "Mizuno", "Srixon", "Wilson", "PXG", "Nike", "Adams"]).optional().describe("Information can be from pgaclubtracker.com, GolfWRX, or other websites. Sponsor should be the sponsor from that year."),
    clubs: zod_1.z.array(zod_1.z.string()).describe("List of clubs the player used that year. Please do not include information about the shaft or grip. Just the club head. Clubs should be the clubs the player used in the specified year."),
    ball: zod_1.z.string().describe("The ball the player used that year, for example, Titleist Pro V1, Taylormade TP5x, etc.").optional(),
});
const PlayerScore = zod_1.z.object({
    name: zod_1.z.string(),
    roundScores: zod_1.z.array(zod_1.z.string()).describe("The scores for each round, 3 rounds for LIV or 4 rounds for other tournaments. Please also show the scores relative to par. For example, 68 (-4), when the par is 72. "),
    finalScore: zod_1.z.string().describe("The final score for the tournament. For example, 68 (-4), when the par is 72. This should be the cumulative total of round scores."),
    prizeMoney: zod_1.z.number().describe("The prize money the player won for their position in the standings."),
    position: zod_1.z.string().describe("The position of the player in the tournament. For example, 1 for first, 2 for second, T2 if there was a tie for 2nd.")
});
exports.GolfTournamentCardStructure = zod_1.z.object({
    name: zod_1.z.string(),
    location: zod_1.z.string(),
    course: zod_1.z.string(),
    summary: zod_1.z.string(),
    dates: zod_1.z.string().describe("The dates of the tournament. for example, Dec 5-8, 2023"),
    weather: zod_1.z.string(),
    purse: zod_1.z.number(),
    players: zod_1.z.array(PlayerScore).describe("The top 10 players from the tournament."),
    year: zod_1.z.number(),
});
// Define base parameter types
const baseType = zod_1.z.union([
    zod_1.z.literal("string"),
    zod_1.z.literal("number"),
    zod_1.z.literal("boolean"),
    zod_1.z.literal("array"),
    zod_1.z.literal("object"),
]);
const parametersSchema = zod_1.z.object({
    type: zod_1.z.literal("object").describe("Defines the structure of the parameters."),
    // TODO: issue is with z.record..., skip trying to make it recursive for now.
    properties: zod_1.z.record(zod_1.z.string(), zod_1.z.object({
        type: zod_1.z.union([
            zod_1.z.literal("string"),
            zod_1.z.literal("number"),
            zod_1.z.literal("boolean"),
            zod_1.z.literal("array"),
            //z.literal("object"),
        ]),
        description: zod_1.z.string().optional(),
        //items: z.lazy(() => parametersSchema.optional()).optional(), // For arrays or nested objects
        //properties: z.lazy(() => z.record(parametersSchema).optional()), // Nested properties
        //required: z.array(z.string()).optional(), // Required keys for nested properties
    })),
    required: zod_1.z
        .array(zod_1.z.string())
        .describe("List of required parameter names."),
});
exports.ChatCompletionToolSchema = zod_1.z.object({
    name: zod_1.z.string().describe("The name of the function to be called. Must be a-z, A-Z, 0-9, or contain underscores and dashes, with a maximum length of 64."),
    description: zod_1.z.string().describe("A description of what the function does, used by the model to choose when and how to call the function."),
    parameters: parametersSchema.describe("The parameters the functions accepts, described as a JSON Schema object. See the guide](https://platform.openai.com/docs/guides/function-calling) for examples," +
        "and the [JSON Schema reference](https://json-schema.org/understanding-json-schema/) for documentation about the format. Omitting `parameters` defines a function with an empty parameter list."),
    strict: zod_1.z.boolean().describe("Whether to enable strict schema adherence when generating the function call. If" +
        "set to true, the model will follow the exact schema defined in the `parameters` field. Only a subset of JSON Schema is supported when `strict` is `true`. Learn" +
        "more about Structured Outputs in the [function calling guide](docs/guides/function-calling).")
});
//# sourceMappingURL=types.js.map