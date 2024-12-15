"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.golfPlayerAgent = golfPlayerAgent;
exports.golfTournamentAgent = golfTournamentAgent;
const express_1 = __importDefault(require("express"));
const openai_1 = require("openai");
const types_1 = require("../types");
const zod_1 = require("openai/helpers/zod");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const renderableFeUtils_1 = require("../renderableFe/renderableFeUtils");
const redisClient_1 = require("../redis/redisClient");
const redisUtils_1 = require("../redis/redisUtils");
const preWarmRedis = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Example: Preload some key-value pairs necessary to render logos.
        const data = [
            { key: 'tourlogo:LIV', value: 'https://i0.wp.com/golfblogger.com/wp-content/uploads/2022/05/liv-golf-logo.png?ssl=1' },
            { key: 'tourlogo:PGA', value: 'https://upload.wikimedia.org/wikipedia/en/thumb/7/77/PGA_Tour_logo.svg/1200px-PGA_Tour_logo.svg.png' },
            { key: 'tourlogo:DP', value: 'https://sportspro.com/wp-content/uploads/2023/03/DP-World-Tour-Logo.png' },
            { key: 'tourlogo:LPGA', value: 'https://cdn.cookielaw.org/logos/9c8a7e84-2713-496b-bb8b-4ab1c7aa9853/01917b66-958c-71d8-80e3-efefcbc9cdc9/9ed04020-943b-462b-ac02-b19496f9ce72/BRD23_LOGO_-_FLAT_RGB_VERT_(1).png' },
            { key: 'tourlogo:Champions', value: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/fe/PGA_Tour_Champions_logo.svg/640px-PGA_Tour_Champions_logo.svg.png' },
            { key: 'sponsorlogo:TaylorMade', value: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/TaylorMade.svg' },
            { key: 'sponsorlogo:Titleist', value: 'https://upload.wikimedia.org/wikipedia/commons/d/d6/Titleist_golf_logo.png' },
            { key: 'sponsorlogo:Callaway', value: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Callaway_Golf_Company_logo.svg/2560px-Callaway_Golf_Company_logo.svg.png' },
            { key: 'sponsorlogo:Ping', value: 'https://upload.wikimedia.org/wikipedia/commons/3/37/Ping-logo.png' },
            { key: 'sponsorlogo:Mizuno', value: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/MIZUNO_logo.svg/2560px-MIZUNO_logo.svg.png' },
            { key: 'sponsorlogo:Srixon', value: 'https://upload.wikimedia.org/wikipedia/commons/f/f5/Srixon_golf_logo.PNG' },
            { key: 'sponsorlogo:Wilson', value: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Wilson-logo.svg/1024px-Wilson-logo.svg.png' },
            { key: 'sponsorlogo:PXG', value: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/PXG_Logo.svg/1280px-PXG_Logo.svg.png' },
            { key: 'sponsorlogo:Nike', value: 'https://logos-world.net/wp-content/uploads/2020/04/Nike-Logo.png' },
            { key: 'sponsorlogo:Adams', value: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Adams_golf_brand_logo.png' }
        ];
        for (const { key, value } of data) {
            yield redisClient_1.redisClient.set(key, value);
        }
        console.log('Redis pre-warmed with initial data');
    }
    catch (error) {
        console.error('Error pre-warming Redis:', error);
    }
});
const app = (0, express_1.default)();
const port = process.env.REACT_APP_PORT;
dotenv_1.default.config();
app.use(express_1.default.json());
app.use((0, cors_1.default)({ origin: '*' }));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});
(0, redisClient_1.connectRedis)();
preWarmRedis();
// Endpoint to set a key-value pair, if the value is complex (use this for the decider graph).
app.post('/api/redis', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { key, value } = req.body;
    try {
        yield redisClient_1.redisClient.set(key, JSON.stringify(value)); // Serialize complex objects
        res.status(200).send({ message: 'Key-Value pair saved to Redis' });
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Error saving data to Redis' });
    }
}));
// Endpoint to get a value by key
app.get('/api/redis/:key', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { key } = req.params;
    try {
        const value = yield redisClient_1.redisClient.get(key);
        res.status(200).send({ key, value: value ? JSON.parse(value) : null });
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Error retrieving data from Redis' });
    }
}));
const router = express_1.default.Router();
router.post('/api/renderabl', renderableBe);
router.post('/api/generateRenderabl', generateComponent);
router.post('/api/mutateRenderabl', mutateComponent);
app.use(router);
const openai = new openai_1.OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const tools = [
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
// Use Structured Outputs and fake API calls to simulate agent.
function personAgent(person) {
    return __awaiter(this, void 0, void 0, function* () {
        let res;
        try {
            const prompt = { role: "user", content: person };
            const response = yield openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [{
                        role: "system",
                        content: "You are a helpful assistant that gathers information about a particular person."
                    }, prompt],
                response_format: (0, zod_1.zodResponseFormat)(types_1.PersonCardStructure, "person_card_structure"),
            });
            const result = response.choices[0].message.content;
            const parsedOutput = JSON.parse(result);
            if (parsedOutput.name) {
                parsedOutput.profilePictureUrl = yield getPictureUrl(parsedOutput.name, 1.0);
            }
            const messageResponse = {
                role: "system",
                content: "chat response with a UI card about the person.",
                personCard: parsedOutput,
                cardType: "person"
            };
            return messageResponse;
        }
        catch (error) {
            console.error('Error from OpenAI:', error);
        }
    });
}
// Fetch a picture URL from Google Custom Image Search API
// @query: the query to search for
// @ratio: the aspect ratio the picture must satisfy
function getPictureUrl(query, ratio) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const CX = '70fc0f5d68c984853';
            const FILE_TYPE = 'jpg';
            const googleApiUrl = `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_API_KEY}&cx=${CX}&q=${query}&searchType=image&num=5&fileType=${FILE_TYPE}`;
            // Use fetch to call the Google API
            const response = yield fetch(googleApiUrl);
            if (!response.ok) {
                throw new Error(`Google API error: ${response.statusText}`);
            }
            const data = yield response.json();
            for (const item of data.items) {
                if (item.link && item.image.width > 0 && item.image.height > 0) {
                    const aspectRatio = item.image.width / item.image.height;
                    if (aspectRatio >= ratio) {
                        return item.link;
                    }
                }
            }
        }
        catch (error) {
            console.error('Error fetching data from Google API:', error);
            return "";
        }
    });
}
// Fetch a youtube video id from YouTube V3 Data API
// @query: query to search for
function getYouTubeVodId(query) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const youtubeApiUrl = `https://www.googleapis.com/youtube/v3/search?key=${process.env.GOOGLE_API_KEY}&part=snippet&q=${query}&maxResults=5`;
            const response = yield fetch(youtubeApiUrl);
            if (!response.ok) {
                throw new Error(`YouTube API error: ${response.statusText}`);
            }
            const data = yield response.json();
            for (const item of data.items) {
                if (item.id && item.id.videoId) {
                    return item.id.videoId;
                }
            }
        }
        catch (error) {
            console.error('Error fetching data from YouTube V3 Data API:', error);
            return "";
        }
    });
}
// Use Structured Outputs and fake API calls to simulate golf player agent.
function golfPlayerAgent(player, year) {
    return __awaiter(this, void 0, void 0, function* () {
        let res;
        try {
            if (!year) {
                year = new Date().getFullYear();
            }
            const playerInYear = player + " in " + year;
            const prompt = { role: "user", content: playerInYear };
            const responsePromise = openai.chat.completions.create({
                model: "gpt-4o",
                messages: [{
                        role: "system",
                        content: "You are a helpful assistant that gathers information about a golf player in a specific year. If the year is not specified, get information up to the current year. If the year is specified, only get information that was available up to that year."
                    }, prompt],
                response_format: (0, zod_1.zodResponseFormat)(types_1.GolfPlayerCardStructure, "golf_player_card_structure"),
            });
            const pictureUrlPromise = getPictureUrl(playerInYear, 1.0);
            const [response, profilePictureUrl] = yield Promise.all([responsePromise, pictureUrlPromise]);
            const result = response.choices[0].message.content;
            const parsedOutput = JSON.parse(result);
            parsedOutput.profilePictureUrl = profilePictureUrl;
            if (year != new Date().getFullYear()) {
                parsedOutput.year = year;
            }
            const messageResponse = {
                role: "system",
                content: "chat response with a UI card about the golf player.",
                golfPlayerCard: parsedOutput,
                cardType: "player"
            };
            // Get Sponsor and Tour logos from Redis.
            parsedOutput.sponsorLogoUrl = yield redisClient_1.redisClient.get((0, redisUtils_1.createSponsorLogoKey)(parsedOutput.sponsor));
            parsedOutput.tourLogoUrl = yield redisClient_1.redisClient.get((0, redisUtils_1.createTourLogoKey)(parsedOutput.tour));
            return messageResponse;
        }
        catch (error) {
            console.error('Error from OpenAI:', error);
        }
    });
}
// Use Structured Outputs and fake API calls to simulate golf player agent.
function golfTournamentAgent(tournament, year) {
    return __awaiter(this, void 0, void 0, function* () {
        let res;
        try {
            const prompt = { role: "user", content: tournament + " golf tournament " + "in " + year };
            const responsePromise = openai.chat.completions.create({
                model: "gpt-4o",
                messages: [{
                        role: "system",
                        content: "You are a helpful assistant that gathers information about a golf tournament from a certain year."
                    }, prompt],
                response_format: (0, zod_1.zodResponseFormat)(types_1.GolfTournamentCardStructure, "golf_tournament_card_structure"),
            });
            const coursePicturePromise = getPictureUrl(tournament + " " + year + " golf tournament", 0.9);
            const videoPromise = getYouTubeVodId(tournament + " " + year + " golf tournament highlights");
            const [response, coursePictureUrl, ytHighlightsId] = yield Promise.all([responsePromise, coursePicturePromise, videoPromise]);
            const result = response.choices[0].message.content;
            const parsedOutput = JSON.parse(result);
            parsedOutput.coursePictureUrl = coursePictureUrl;
            parsedOutput.ytHighlightsId = ytHighlightsId;
            console.log(coursePictureUrl);
            console.log(ytHighlightsId);
            const messageResponse = {
                role: "system",
                content: "chat response with a UI card about the golf tournament.",
                golfTournamentCard: parsedOutput,
                cardType: "tournament"
            };
            return messageResponse;
        }
        catch (error) {
            console.error('Error from OpenAI:', error);
        }
    });
}
// Generic chat response agent.
function chatAgent(prompt) {
    return __awaiter(this, void 0, void 0, function* () {
        let res;
        try {
            const response = yield openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [{
                        role: "system",
                        content: "You are a helpful assistant that responds to chat messages."
                    }, ...prompt],
            });
            const messageResponse = {
                role: "system",
                content: response.choices[0].message.content,
                cardType: "string"
            };
            return messageResponse;
        }
        catch (error) {
            console.error('Error from OpenAI:', error);
        }
    });
}
// function monitoringGraphAgent(handlerName : string) : Message {
//   const response : Message = {
//     role: "system",
//     content: "chat response with monitoring graph data to render.",
//     graph: { handlerName: handlerName, inputData: getTrafficData(handlerName)},
//     cardType: "graph"
//   }
//   return response
// }
function agentDeciderAndRunner(responseString) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = JSON.parse(responseString);
        const toolCall = response.choices[0].message.tool_calls[0];
        const functionName = toolCall.function.name;
        const args = JSON.parse(toolCall.function.arguments);
        switch (functionName) {
            case "chatAgent":
                return chatAgent(args.messages);
            // case "personAgent":
            //   return personAgent(args.person);
            // case "monitoringGraphAgent":
            //   return monitoringGraphAgent(args.handlerName);
            case "golfPlayerAgent":
                return args.year ? golfPlayerAgent(args.player, args.year) : golfPlayerAgent(args.player);
            case "golfTournamentAgent":
                return golfTournamentAgent(args.tournament, args.year);
        }
    });
}
function renderableBe(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const prompt = req.body.messages;
        if (!req.is('application/json')) {
            return res.status(400).json({ error: 'Invalid request body' });
        }
        if (!prompt) {
            return res.status(400).json({ error: "Prompt is required" });
        }
        const functionCallResponse = yield openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{
                    role: "system",
                    content: "You are an agent that determines what function in the tools to call given the user prompt. You can use the entire messages array as context, but please only respond to the last message."
                }, ...prompt],
            tools: tools,
        });
        const messageResponse = yield agentDeciderAndRunner(JSON.stringify(functionCallResponse));
        return res.status(200).json(messageResponse);
    });
}
function generateComponent(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const prompt = req.body;
        if (!req.is('application/json')) {
            return res.status(400).json({ error: 'Invalid request body' });
        }
        if (!prompt) {
            return res.status(400).json({ error: "Prompt is required" });
        }
        (0, renderableFeUtils_1.generateComponentFile)(prompt.directoryPath, prompt.agentName, prompt.agentProps, prompt.agentDescription, prompt.outputPath);
        redisClient_1.redisClient.set((0, redisUtils_1.createFileKey)(prompt.agentName), prompt.outputPath);
        return res.status(200);
    });
}
function mutateComponent(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const prompt = req.body;
        if (!req.is('application/json')) {
            return res.status(400).json({ error: 'Invalid request body' });
        }
        if (!prompt) {
            return res.status(400).json({ error: "Prompt is required" });
        }
        const fileLocation = yield redisClient_1.redisClient.get((0, redisUtils_1.createFileKey)(prompt.agentName));
        if (!fileLocation) {
            return res.status(400).json({ error: "File location not found" });
        }
        (0, renderableFeUtils_1.mutateComponentFile)(fileLocation, prompt.agentName, prompt.mutation);
        return res.status(200);
    });
}
app.listen(port, () => {
    console.log('API listening on port:', port);
});
//# sourceMappingURL=backend.js.map