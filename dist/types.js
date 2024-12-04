"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GolfPlayerCardStructure = exports.PersonCardStructure = void 0;
const zod_1 = require("zod");
exports.PersonCardStructure = zod_1.z.object({
    name: zod_1.z.string(),
    summary: zod_1.z.string(),
    birthday: zod_1.z.string(),
    death: zod_1.z.string(),
    age: zod_1.z.number(),
    occupation: zod_1.z.string().describe("occupation the person is best known for in 5 words or less"),
    alma_mater: zod_1.z.string(),
    hometown: zod_1.z.string(),
    spouses: zod_1.z.array(zod_1.z.string()),
    awards: zod_1.z.array(zod_1.z.string()),
    profilePictureUrl: zod_1.z.string().optional(),
});
exports.GolfPlayerCardStructure = zod_1.z.object({
    name: zod_1.z.string(),
    height: zod_1.z.string(),
    birthday: zod_1.z.string(),
    age: zod_1.z.number(),
    rank: zod_1.z.number().describe("Rank the player is in the world according to the Official World Golf Ranking System."),
    tour: zod_1.z.enum(["LIV", "PGA", "LPGA", "DP", "Korn Ferry", "Asia", "Champions"]).describe("The logo of the tour the player most recently played in. One of LIV Golf, PGA Tour, DP World Tour, Korn Ferry Tour, Asia Tour, LPGA tour, PGA Tour Champions, etc. If the player moved from PGA to LIV, please default to LIV. See the LIV golf roster from livgolf.com/player, for the current PGA Tour roster, see pgatour.com/players, for Korn Ferry, see pgatour.com/korn-ferry-tour/players"),
    alma_mater: zod_1.z.string(),
    hometown: zod_1.z.string(),
    recent_win: zod_1.z.string().describe("the most recent LIV, DP World Tour, or PGA Tour tournament win. Please include the year of the tournament as well.").optional(),
    profilePictureUrl: zod_1.z.string().optional(),
    sponsor: zod_1.z.enum(["TaylorMade", "Titleist", "Callaway", "Ping", "Mizuno", "Srixon", "Wilson", "PXG"]).optional().describe("Please get your information from pgaclubtracker.com"),
    clubs: zod_1.z.array(zod_1.z.string()).describe("List of clubs the player is most recently used. Please include the shaft specs if possible."),
    ball: zod_1.z.string().describe("The ball the player most recently used, for example, Titleist Pro V1, Taylormade TP5x, etc.").optional(),
});
//# sourceMappingURL=types.js.map