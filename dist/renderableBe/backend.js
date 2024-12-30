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
const express_1 = __importDefault(require("express"));
const openai_1 = require("openai");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const renderableFeUtils_1 = require("../renderableFe/renderableFeUtils");
const redisClient_1 = require("../redis/redisClient");
const redisUtils_1 = require("../redis/redisUtils");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.REACT_APP_PORT;
app.use(express_1.default.json());
app.use((0, cors_1.default)({ origin: '*' }));
app.use((_, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});
app.options('*', (0, cors_1.default)());
(0, redisClient_1.connectRedis)();
// Endpoint to set a key-value pair, if the value is complex (use this for the decider graph).
app.post('/api/redis', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { key, value } = req.body;
    try {
        yield redisClient_1.redisClient.set(key, JSON.stringify(value));
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
router.post('/api/generateRenderabl', generateAgent);
router.post('/api/mutateRenderabl', mutateAgent);
router.post('/api/provideContext', provideContext);
router.get('/api/getContext', getContext);
router.get('/api/getToolGraph', getToolGraph);
router.post('/api/getFunctionCallDecision', getFunctionCallDecision);
router.post('/api/writeToolNode', writeToolNodeEndpoint);
router.post('/api/generateComponent', generateComponentEndpoint);
app.use(router);
const openai = new openai_1.OpenAI({ apiKey: process.env.OPENAI_API_KEY });
function generateComponentEndpoint(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const body = req.body;
        if (!req.is('application/json')) {
            return res.status(400).json({ error: 'Invalid request body' });
        }
        if (!body) {
            return res.status(400).json({ error: "Prompt is required" });
        }
        const component = yield (0, renderableFeUtils_1.generateComponent)(body.agentName, body.agentProps, body.agentDescription, body.similarComponents);
        return res.status(200).json(component);
    });
}
function writeToolNodeEndpoint(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const body = req.body;
        if (!req.is('application/json')) {
            return res.status(400).json({ error: 'Invalid request body' });
        }
        if (!body) {
            return res.status(400).json({ error: "Prompt is required" });
        }
        const contextDataJson = yield redisClient_1.redisClient.get('contextData');
        const toolNode = yield (0, renderableFeUtils_1.generateToolNode)(body.agentName, body.agentDescription, body.agentArgs, contextDataJson);
        const toolGraphJson = yield redisClient_1.redisClient.get('toolGraph');
        const toolGraph = JSON.parse(toolGraphJson);
        toolGraph.push(toolNode);
        redisClient_1.redisClient.set('toolGraph', JSON.stringify(toolGraph));
        return res.status(200).json(toolNode);
    });
}
function getFunctionCallDecision(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const body = req.body;
        if (!req.is('application/json')) {
            return res.status(400).json({ error: 'Invalid request body' });
        }
        if (!body) {
            return res.status(400).json({ error: "Prompt is required" });
        }
        const toolGraphJson = yield redisClient_1.redisClient.get('toolGraph');
        const toolGraph = JSON.parse(toolGraphJson);
        const prompt = {
            role: "user",
            content: body.prompt
        };
        const response = yield openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{
                    role: "system",
                    content: `You are an agent that determines which function in the tools to call given the user's prompt. Use the entire conversation history for context, but prioritize the last user message for making your decision. If no other function is appropriate, default to calling the "chatAgent" function.`
                }, prompt],
            tools: toolGraph,
        });
        if (!response.choices[0].message.tool_calls) {
            // Default to chat agent if there are no valid function calls. 
            return res.status(200).json({ message: "No valid function calls found" });
        }
        else {
            const toolCall = response.choices[0].message.tool_calls[0];
            const functionName = toolCall.function.name;
            const args = JSON.parse(toolCall.function.arguments);
            return res.status(200).json({ message: "Function Name: " + functionName + " with arguments: " + JSON.stringify(args) });
        }
    });
}
function provideContext(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const prompt = req.body;
        if (!req.is('application/json')) {
            return res.status(400).json({ error: 'Invalid request body' });
        }
        if (!prompt) {
            return res.status(400).json({ error: "Prompt is required" });
        }
        const kvObject = prompt;
        if (!kvObject) {
            return res.status(400).json({ error: "Valid kv-pair object is required" });
        }
        redisClient_1.redisClient.set('contextData', JSON.stringify(prompt));
        return res.status(200).json({ message: "Context provided successfully" });
    });
}
function getContext(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const contextData = yield redisClient_1.redisClient.get('contextData');
        return res.status(200).json(contextData);
    });
}
function getToolGraph(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const toolGraph = yield redisClient_1.redisClient.get('toolGraph');
        return res.status(200).json(toolGraph);
    });
}
function generateAgent(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const prompt = req.body;
        if (!req.is('application/json')) {
            return res.status(400).json({ error: 'Invalid request body' });
        }
        if (!prompt) {
            return res.status(400).json({ error: "Prompt is required" });
        }
        const generateComponentPromise = (0, renderableFeUtils_1.generateComponentFile)(prompt.directoryPath, prompt.agentName, prompt.agentProps, prompt.agentDescription, prompt.outputPath);
        const [toolGraphJson, contextDataJson] = yield Promise.all([redisClient_1.redisClient.get('toolGraph'), redisClient_1.redisClient.get('contextData')]);
        const generateToolNodePromise = (0, renderableFeUtils_1.generateToolNode)(prompt.agentName, prompt.agentDescription, prompt.agentArgs, contextDataJson);
        const [_, toolNode] = yield Promise.all([generateComponentPromise, generateToolNodePromise]);
        const toolGraph = JSON.parse(toolGraphJson);
        toolGraph.push(toolNode);
        redisClient_1.redisClient.set('toolGraph', JSON.stringify(toolGraph));
        redisClient_1.redisClient.set((0, redisUtils_1.createFileKey)(prompt.agentName), prompt.outputPath);
        return res.status(200).json({ message: "File generated successfully" });
    });
}
function mutateAgent(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const body = req.body;
        if (!req.is('application/json')) {
            return res.status(400).json({ error: 'Invalid request body' });
        }
        if (!prompt) {
            return res.status(400).json({ error: "Prompt is required" });
        }
        const fileLocation = yield redisClient_1.redisClient.get((0, redisUtils_1.createFileKey)(body.agentName));
        if (!fileLocation) {
            return res.status(400).json({ error: "File location not found" });
        }
        (0, renderableFeUtils_1.mutateComponentFile)(fileLocation, body.agentName, body.mutation);
        return res.status(200).json({ message: "File mutated successfully" });
    });
}
app.listen(port, () => {
    console.log('API listening on port:', port);
});
//# sourceMappingURL=backend.js.map