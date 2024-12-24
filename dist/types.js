"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParameterSchema = exports.GolfTournamentCardStructure = exports.GolfPlayerCardStructure = exports.PersonCardStructure = void 0;
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
exports.ParameterSchema = zod_1.z.object({
    parameters: zod_1.z.record(zod_1.z.string(), zod_1.z.object({
        type: zod_1.z.union([
            zod_1.z.literal("string"),
            zod_1.z.literal("number"),
            zod_1.z.literal("boolean"),
            zod_1.z.literal("array"),
            // z.literal("object"),
        ]),
    })),
});
// export const generateZodSchema = (propsBody: string) => {
//   const properties: Record<string, any> = {};
//   const propertyRegex = /(\w+):\s*([^;,\n]+)\s*(?:;|\n|,|$)/g;
//   let match;
//   while ((match = propertyRegex.exec(propsBody))) {
//     const [, key, type] = match;
//     let zodType;
//     // Map TypeScript types to Zod types
//     switch (type.trim()) {
//       case "string":
//         zodType = z.string();
//         break;
//       case "number":
//         zodType = z.number();
//         break;
//       case "boolean":
//         zodType = z.boolean();
//         break;
//       case "string[]":
//         zodType = z.array(z.string());
//         break;
//       case "number[]":
//         zodType = z.array(z.number());
//         break;
//       case "boolean[]":
//         zodType = z.array(z.boolean());
//         break;
//       default:
//         throw new Error(`Unhandled type: ${type}`);
//     }
//     properties[key] = zodType;
//   }
//   return z.object(properties);
// };
//# sourceMappingURL=types.js.map