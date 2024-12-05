"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GolfTournamentCardStructure = exports.GolfPlayerCardStructure = exports.PersonCardStructure = void 0;
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
    recent_win: zod_1.z.string().describe("the most recent LIV, DP World Tour, or PGA Tour tournament win the player won. Please include the year of the tournament as well.").optional(),
    sponsor: zod_1.z.enum(["TaylorMade", "Titleist", "Callaway", "Ping", "Mizuno", "Srixon", "Wilson", "PXG"]).optional().describe("Information can be from pgaclubtracker.com, GolfWRX, or other websites"),
    clubs: zod_1.z.array(zod_1.z.string()).describe("List of clubs the player is most recently used. Please include the shaft specs if possible."),
    ball: zod_1.z.string().describe("The ball the player most recently used, for example, Titleist Pro V1, Taylormade TP5x, etc.").optional(),
});
const PlayerScore = zod_1.z.object({
    name: zod_1.z.string(),
    round_scores: zod_1.z.array(zod_1.z.string()).describe("The scores for each round, 3 rounds for LIV or 4 rounds for other tournaments. Please also show the scores relative to par. For example, 68 (-4), when the par is 72. "),
    final_score: zod_1.z.string().describe("The final score for the tournament. For example, 68 (-4), when the par is 72. This should be the cumulative total of round scores."),
    prize_money: zod_1.z.number().describe("The prize money the player won for their position in the standings."),
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
});
//# sourceMappingURL=types.js.map