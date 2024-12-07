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
const types_1 = require("./types");
const zod_1 = require("openai/helpers/zod");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const fakedb_1 = require("./fakedb");
const app = (0, express_1.default)();
const port = process.env.REACT_APP_PORT || 5500;
dotenv_1.default.config();
app.use(express_1.default.json());
app.use((0, cors_1.default)({ origin: '*' }));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // Or specify allowed origins
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});
const router = express_1.default.Router();
router.post('/api/openai', postCall);
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
    {
        type: "function",
        function: {
            name: "monitoringGraphAgent",
            description: "Get monitoring graph data. Call whenever you need to respond to a prompt that asks for monitoring graph data of a handler.",
            parameters: {
                type: "object",
                properties: {
                    handlerName: { type: "string", description: "The name of the handler to get monitoring graph data on." },
                },
                required: ["handlerName"],
            },
        }
    },
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
function getPictureUrl(topic, ratio, size) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const CX = '70fc0f5d68c984853';
            const FILE_TYPE = 'jpg';
            const googleApiUrl = `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_IMAGE_SEARCH_KEY}&cx=${CX}&q=${topic}&searchType=image&num=5&fileType=${FILE_TYPE}`;
            if (size) {
                const googleApiUrl = `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_IMAGE_SEARCH_KEY}&cx=${CX}&q=${topic}&searchType=image&num=5&fileType=${FILE_TYPE}&imgSize=${size}`;
            }
            // Use fetch to call the Google API
            const response = yield fetch(googleApiUrl);
            if (!response.ok) {
                throw new Error(`Google API error: ${response.statusText}`);
            }
            const data = yield response.json();
            console.log(topic);
            for (const item of data.items) {
                if (item.link && item.image.width > 0 && item.image.height > 0) {
                    console.log(item.link);
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
            const pictureUrlPromise = getPictureUrl(playerInYear, 0.7);
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
            const [response, coursePictureUrl] = yield Promise.all([responsePromise, coursePicturePromise]);
            const result = response.choices[0].message.content;
            const parsedOutput = JSON.parse(result);
            parsedOutput.course_picture_url = coursePictureUrl;
            // TODO: make call to YouTube to get highlights to video
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
function monitoringGraphAgent(handlerName) {
    const response = {
        role: "system",
        content: "chat response with monitoring graph data to render.",
        graph: { handlerName: handlerName, inputData: (0, fakedb_1.getTrafficData)(handlerName) },
        cardType: "graph"
    };
    return response;
}
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
            case "monitoringGraphAgent":
                return monitoringGraphAgent(args.handlerName);
            case "golfPlayerAgent":
                if (args.year) {
                    return golfPlayerAgent(args.player, args.year);
                }
                return golfPlayerAgent(args.player);
            case "golfTournamentAgent":
                return golfTournamentAgent(args.tournament, args.year);
        }
    });
}
function postCall(req, res) {
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
app.listen(port, () => {
    console.log('API listening on port:', port);
});
//# sourceMappingURL=backend.js.map