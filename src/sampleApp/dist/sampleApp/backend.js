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
exports.jobQueryAgent = jobQueryAgent;
exports.golfPlayerAgent = golfPlayerAgent;
exports.golfTournamentAgent = golfTournamentAgent;
exports.getPictureUrl = getPictureUrl;
exports.getYouTubeVodId = getYouTubeVodId;
const express_1 = __importDefault(require("express"));
const openai_1 = require("openai");
const types_1 = require("./types");
const zod_1 = require("openai/helpers/zod");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const redisClient_1 = require("../redis/redisClient");
const redisUtils_1 = require("../redis/redisUtils");
const zod_2 = require("zod");
const client_1 = require("@prisma/client");
const uuid_1 = require("uuid");
dotenv_1.default.config();
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
            { key: 'sponsorlogo:Adams', value: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Adams_golf_brand_logo.png' },
            { key: 'toolGraph', value: JSON.stringify(toolsSet) },
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
const jobQueryTool = (0, zod_1.zodFunction)({
    name: "jobQueryAgent",
    description: "Call whenever the prompt indicates we want to query for jobs that are stored in the database.",
    parameters: types_1.QueryJobSchema
});
const chatTool = (0, zod_1.zodFunction)({
    name: "chatAgent",
    description: "Default to this whenever the other tools, such as personAgent, are not appropriate. Do not respond to the chat message itself.",
    parameters: zod_2.z.object({
        messages: zod_2.z.array(zod_2.z.object({
            role: zod_2.z.enum(["system", "user", "assistant"]).describe("The role of the sender of the chat message"),
            content: zod_2.z.string().describe("The content of the chat message"),
        }))
    }),
});
const golfPlayerTool = (0, zod_1.zodFunction)({
    name: "golfPlayerAgent",
    description: "Get information about a golf player. Call whenever you need to respond to a prompt that asks about a golf player, and maybe from a specific year.",
    parameters: zod_2.z.object({
        player: zod_2.z.string().describe("The name of the golf player to get information on."),
        year: zod_2.z.number()
            .optional()
            .describe("The year to get information about the golf player. If not specified, leave empty."),
    }),
});
const golfTournamentTool = (0, zod_1.zodFunction)({
    name: "golfTournamentAgent",
    description: "Get information about a golf tournament's results from a specific year. Call whenever you need to respond to a prompt that asks about a golf tournament.",
    parameters: zod_2.z.object({
        tournament: zod_2.z.string().describe("The name of the golf tournament to get information on."),
        year: zod_2.z.number().describe("The year to get information about the golf tournament. If not specified, leave empty."),
    }),
});
let toolsSet = [
    chatTool,
    golfPlayerTool,
    golfTournamentTool,
    jobQueryTool
];
const app = (0, express_1.default)();
const port = process.env.SAMPLE_APP_PORT;
const openai = new openai_1.OpenAI({ apiKey: process.env.OPENAI_API_KEY });
app.use(express_1.default.json());
app.use((0, cors_1.default)({ origin: '*' }));
app.use((_, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});
(0, redisClient_1.connectRedis)();
preWarmRedis();
const router = express_1.default.Router();
router.post('/api/renderabl', renderableBe);
app.use(router);
const prisma = new client_1.PrismaClient();
const generateRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const generateRandomBoolean = () => Math.random() < 0.5;
generateCronJobData();
function generateCronJobData() {
    return __awaiter(this, void 0, void 0, function* () {
        const jobsData = [];
        types_1.cronJobNamesArray.forEach((jobName) => {
            types_1.cellNamesArray.forEach((cellName) => {
                const job = {
                    id: (0, uuid_1.v4)(),
                    name: jobName,
                    cell: cellName,
                    createdAt: new Date().toISOString(),
                    durationMin: generateRandomInt(1, 120),
                    success: generateRandomBoolean(),
                    resourceUsage: generateRandomInt(1, 100) + Math.random(),
                };
                jobsData.push(job);
            });
        });
        try {
            const result = yield prisma.job.createMany({
                data: jobsData,
            });
            console.log("Batch insert succeeded:", result);
        }
        catch (error) {
            console.error("Error during batch insert:", error);
        }
    });
}
function generateAndRunQuery(queryArgs) {
    return __awaiter(this, void 0, void 0, function* () {
        const { filters, sort, limit } = queryArgs;
        // Base query
        const where = {};
        // Apply filters
        if (filters) {
            filters.forEach((filter) => {
                const { field, operator, value } = filter;
                switch (operator) {
                    case "<":
                    case ">":
                        where[field] = { [operator]: value };
                        break;
                    case "before":
                        where[field] = { lt: new Date(value) };
                        break;
                    case "after":
                        where[field] = { gt: new Date(value) };
                        break;
                    case "equals":
                        where[field] = value;
                        break;
                    case "notEquals":
                        where[field] = { not: value };
                        break;
                }
            });
        }
        // Build query
        const query = {
            where,
            orderBy: sort ? { [sort.field]: sort.order } : undefined,
            take: limit,
        };
        // Fetch results
        const jobs = yield prisma.job.findMany(query);
        console.log("jobs", JSON.stringify(jobs));
        return jobs;
    });
}
function genericAgent(prompt, structure, systemMessage) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: systemMessage,
                },
                prompt
            ],
            response_format: (0, zod_1.zodResponseFormat)(structure, "agent_structure"),
        });
        return response.choices[0].message.content;
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
        const functionCallResponse = yield fetch(`http://localhost:5500/api/getFunctionCallDecision`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt: prompt[prompt.length - 1].content })
        });
        const parsedOutput = yield functionCallResponse.json();
        const messageResponse = yield agentDeciderAndRunner(parsedOutput, prompt);
        return res.status(200).json(messageResponse);
    });
}
function personAgent(person) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const prompt = { role: "user", content: person };
            const result = yield genericAgent(prompt, types_1.PersonCardStructure, "You are a helpful assistant that gathers information about a particular person.");
            const parsedOutput = JSON.parse(result);
            // Client API calls for agent specific features not available to LLM.
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
function jobQueryAgent(args) {
    return __awaiter(this, void 0, void 0, function* () {
        const schema = { filters: args.filters, sort: args.sort, limit: args.limit };
        const jobsArray = yield generateAndRunQuery(schema);
        const messageResponse = {
            role: "system",
            content: "list of data about recent job runs",
            jobContent: jobsArray,
            cardType: "job"
        };
        return messageResponse;
    });
}
function golfPlayerAgent(args) {
    return __awaiter(this, void 0, void 0, function* () {
        let year = args.year;
        if (!args.player) {
            console.error("Player name is required");
            return;
        }
        if (!year) {
            year = new Date().getFullYear();
        }
        try {
            const agentDescription = "You are a helpful assistant that gathers information about a particular golf player in a specific year. If the year is not specified, get information up to the current year. If the year is specified, only get information that was available up to that year.";
            // for whatever reason, GPT doesn't like the comma in the prompt, so I used "in" instead
            const promptContent = args.player + " in " + year;
            const prompt = { role: "user", content: promptContent };
            const [response, profilePictureUrl] = yield Promise.all([genericAgent(prompt, types_1.GolfPlayerCardStructure, agentDescription), getPictureUrl(promptContent, 1.0)]);
            const parsedOutput = JSON.parse(response);
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
            const [sponsorLogoUrl, tourLogoUrl] = yield Promise.all([
                redisClient_1.redisClient.get((0, redisUtils_1.createSponsorLogoKey)(parsedOutput.sponsor)),
                redisClient_1.redisClient.get((0, redisUtils_1.createTourLogoKey)(parsedOutput.tour))
            ]);
            parsedOutput.sponsorLogoUrl = sponsorLogoUrl;
            parsedOutput.tourLogoUrl = tourLogoUrl;
            return messageResponse;
        }
        catch (error) {
            console.error('Error from OpenAI:', error);
        }
    });
}
function golfTournamentAgent(args) {
    return __awaiter(this, void 0, void 0, function* () {
        let year = args.year;
        if (!args.tournament) {
            console.error("Tournament name is required");
            return;
        }
        if (!year) {
            year = new Date().getFullYear();
        }
        try {
            const agentDescription = "You are a helpful assistant that gathers information about a golf tournament in a specific year. If the year is not specified, get information from the most recent tournament.";
            const promptContent = args.tournament + " golf tournament in " + year;
            const prompt = { role: "user", content: promptContent };
            const [response, coursePictureUrl, ytHighlightsId] = yield Promise.all([genericAgent(prompt, types_1.GolfTournamentCardStructure, agentDescription),
                getPictureUrl(promptContent, 0.9), getYouTubeVodId(promptContent + " highlights")
            ]);
            const parsedOutput = JSON.parse(response);
            parsedOutput.coursePictureUrl = coursePictureUrl;
            parsedOutput.ytHighlightsId = ytHighlightsId;
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
function chatAgent(args) {
    return __awaiter(this, void 0, void 0, function* () {
        let prompt;
        if (args instanceof Array) {
            prompt = args;
        }
        else {
            prompt = args.messages;
        }
        if (!prompt) {
            console.error("Prompt for chat agent is required");
            return;
        }
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
function agentDeciderAndRunner(response, prompt) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!response.choices[0].message.tool_calls) {
            // Default to chat agent if there are no valid function calls. 
            return chatAgent(prompt);
        }
        else {
            const toolCall = response.choices[0].message.tool_calls[0];
            const functionName = toolCall.function.name;
            const args = JSON.parse(toolCall.function.arguments);
            console.log("Function Name: " + functionName + " with arguments: " + JSON.stringify(args));
            switch (functionName) {
                case "chatAgent":
                    return chatAgent(args);
                case "personAgent":
                    return personAgent(args.person);
                case "golfPlayerAgent":
                    return golfPlayerAgent(args);
                case "golfTournamentAgent":
                    return golfTournamentAgent(args);
                case "jobQueryAgent":
                    return jobQueryAgent(args);
            }
        }
    });
}
// Fetch a picture URL from Google Custom Image Search API
function getPictureUrl(query, ratio) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const googleApiUrl = `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_API_KEY}&cx=70fc0f5d68c984853&q=${query}&searchType=image&num=5&fileType=jpg`;
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
app.listen(port, () => {
    console.log('API listening on port:', port);
});
//# sourceMappingURL=backend.js.map