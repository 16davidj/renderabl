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
const express_1 = __importDefault(require("express"));
const openai_1 = require("openai");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const types_1 = require("./types");
const client_1 = require("@prisma/client");
const uuid_1 = require("uuid");
const zod_1 = require("zod");
const zod_2 = require("openai/helpers/zod");
dotenv_1.default.config();
const jobQueryTool = (0, zod_2.zodFunction)({
    name: "jobQueryAgent",
    description: "Call whenever the prompt indicates we want to query for jobs that are stored in the database.",
    parameters: types_1.QueryJobSchema
});
const chatTool = (0, zod_2.zodFunction)({
    name: "chatAgent",
    description: "Default to this whenever the other tools, such as personAgent, are not appropriate. Do not respond to the chat message itself.",
    parameters: zod_1.z.object({
        messages: zod_1.z.array(zod_1.z.object({
            role: zod_1.z.enum(["system", "user", "assistant"]).describe("The role of the sender of the chat message"),
            content: zod_1.z.string().describe("The content of the chat message"),
        }))
    }),
});
let tools = [jobQueryTool, chatTool];
const app = (0, express_1.default)();
const port = process.env.REACT_APP_PORT;
const openai = new openai_1.OpenAI({ apiKey: process.env.OPENAI_API_KEY });
app.use(express_1.default.json());
app.use((0, cors_1.default)({ origin: '*' }));
app.use((_, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});
const router = express_1.default.Router();
router.post('/api/getResponse', getResponse);
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
function getResponse(req, res) {
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
                    content: `You are an agent that determines which function in the tools to call given the user's prompt. Use the entire conversation history for context, but prioritize the last user message for making your decision. If no other function is appropriate, default to calling the "chatAgent" function.`
                }, prompt[prompt.length - 1]],
            tools: tools,
        });
        // const functionCallResponse = await fetch(`http://localhost:5500/api/getFunctionCallDecision`, {
        //   method:'POST',
        //   mode: 'cors',
        //   headers: {
        //       'Content-Type': 'application/json'
        //   },
        //   body: JSON.stringify({ prompt: prompt.content })
        // });
        const messageResponse = yield agentDeciderAndRunner(JSON.stringify(functionCallResponse));
        return res.status(200).json(messageResponse);
    });
}
function jobQueryAgent(args) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(args);
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
function agentDeciderAndRunner(responseString) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = JSON.parse(responseString);
        const toolCall = response.choices[0].message.tool_calls[0];
        const functionName = toolCall.function.name;
        const args = JSON.parse(toolCall.function.arguments);
        console.log("Function Name: " + functionName + " with arguments: " + JSON.stringify(args));
        switch (functionName) {
            case "chatAgent":
                return chatAgent(args);
            case "jobQueryAgent":
                return jobQueryAgent(args);
        }
    });
}
app.listen(port, () => {
    console.log('API listening on port:', port);
});
//# sourceMappingURL=backend.js.map