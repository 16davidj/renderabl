"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tools = void 0;
exports.getTrafficData = getTrafficData;
exports.tools = [
    {
        type: "function",
        function: {
            name: "chatAgent",
            description: "Default to this whenever the other tools, such as personAgent, are not appropriate. Do not respond to the chat message itself.",
            parameters: {
                type: "object",
                properties: {
                    messages: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                role: { type: "string", enum: ["system", "user", "assistant"], description: "The role of the sender of the chat message" },
                                content: { type: "string", description: "The content of the chat message" },
                            },
                            required: ["role", "content"],
                        },
                    },
                },
                required: ["messages"],
            },
        }
    },
    // {
    //   type: "function",
    //   function: {
    //     name: "personAgent",
    //     description: "Get information about a person. Call whenever you need to respond to a prompt that asks about a person.",
    //     parameters: {
    //       type: "object",
    //       properties: {
    //         person: { type: "string", description: "The name of the person to get information on." },
    //       },
    //       required: ["person"],
    //     },
    //   }
    // },
    // {
    //   type: "function",
    //   function: {
    //     name: "monitoringGraphAgent",
    //     description: "Get monitoring graph data. Call whenever you need to respond to a prompt that asks for monitoring graph data of a handler.",
    //     parameters: {
    //       type: "object",
    //       properties: {
    //         handlerName: { type: "string", description: "The name of the handler to get monitoring graph data on." },
    //       },
    //       required: ["handlerName"],
    //     },
    //   }
    // },
    {
        type: "function",
        function: {
            name: "golfPlayerAgent",
            description: "Get information about a golf player. Call whenever you need to respond to a prompt that asks about a golf player, and maybe from a specific year.",
            parameters: {
                type: "object",
                properties: {
                    player: { type: "string", description: "The name of the golf player to get information on." },
                    year: { type: "number", description: "The year to get information about the golf player. If not specified, get the current year information." }
                },
                required: ["player"],
            },
        }
    },
    {
        type: "function",
        function: {
            name: "golfTournamentAgent",
            description: "Get information about a golf tournament results from a specific year. Call whenever you need to respond to a prompt that asks about a golf tournament.",
            parameters: {
                type: "object",
                properties: {
                    tournament: { type: "string", description: "The name of the golf tournament to get information on." },
                    year: { type: "number", description: "The year to get information about the golf tournament." }
                },
                required: ["tournament", "year"],
            },
        }
    }
];
const performanceMap = new Map();
performanceMap.set("GetSampleHandler", [
    // points are diurnal
    // Nighttime (low QPS)
    { timestamp: 1695733200000, qps: 20 },
    { timestamp: 1695733260000, qps: 15 },
    { timestamp: 1695733320000, qps: 22 },
    { timestamp: 1695733380000, qps: 18 },
    { timestamp: 1695733440000, qps: 25 },
    { timestamp: 1695733500000, qps: 17 },
    // Morning peak (high QPS)
    { timestamp: 1695734000000, qps: 150 },
    { timestamp: 1695734060000, qps: 180 },
    { timestamp: 1695734120000, qps: 175 },
    { timestamp: 1695734180000, qps: 160 },
    { timestamp: 1695734240000, qps: 190 },
    { timestamp: 1695734300000, qps: 185 },
    // Morning dip (medium QPS)
    { timestamp: 1695735000000, qps: 100 },
    { timestamp: 1695735060000, qps: 95 },
    { timestamp: 1695735120000, qps: 110 },
    { timestamp: 1695735180000, qps: 90 },
    { timestamp: 1695735240000, qps: 105 },
    { timestamp: 1695735300000, qps: 98 },
    // Afternoon peak (high QPS)
    { timestamp: 1695736000000, qps: 160 },
    { timestamp: 1695736060000, qps: 170 },
    { timestamp: 1695736120000, qps: 155 },
    { timestamp: 1695736180000, qps: 165 },
    { timestamp: 1695736240000, qps: 175 },
    { timestamp: 1695736300000, qps: 168 },
    // Evening dip (medium QPS)
    { timestamp: 1695737000000, qps: 90 },
    { timestamp: 1695737060000, qps: 100 },
    { timestamp: 1695737120000, qps: 85 },
    { timestamp: 1695737180000, qps: 95 },
    { timestamp: 1695737240000, qps: 105 },
    { timestamp: 1695737300000, qps: 98 },
    // Nighttime (low QPS)
    { timestamp: 1695740000000, qps: 25 },
    { timestamp: 1695740060000, qps: 20 },
    { timestamp: 1695740120000, qps: 22 },
    { timestamp: 1695740180000, qps: 18 },
    { timestamp: 1695740240000, qps: 25 },
    { timestamp: 1695740300000, qps: 17 },
]);
function getTrafficData(name) {
    if (performanceMap.has(name)) {
        return performanceMap.get(name);
    }
    return [];
}
//# sourceMappingURL=fakedb.js.map