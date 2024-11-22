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
const types_1 = require("./types");
const zod_1 = require("openai/helpers/zod");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = process.env.PORT || 5500;
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
const openai = new openai_1.OpenAI({ apiKey: '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' });
// TODO: function calling
// const tools = [
//     {
//         type: "function",
//         function: {
//             name: "personStructureOutput",
//             description: "Makes a call to OpenAI chat completion whenever the prompt asks about who someone is. Call this whenever the prompt resembles: 'Who is [person name]'",
//             parameters: {
//                 type: "object",
//                 properties: {
//                     order_id: {
//                         type: "string",
//                         description: "The customer's order ID.",
//                     },
//                 },
//                 required: ["order_id"],
//                 additionalProperties: false,
//             },
//         },
//     },
// ];
// TODO: interface this function by type
function personStructureOutput(prompt) {
    return __awaiter(this, void 0, void 0, function* () {
        let res;
        try {
            const response = yield openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [{
                        role: "system",
                        content: "You are a helpful assistant as a chatbot, responding to user input."
                    }, ...prompt],
                response_format: (0, zod_1.zodResponseFormat)(types_1.PersonCardStructure, "person_card_structure")
            });
            const result = response.choices[0].message.content;
            const parsedOutput = JSON.parse(result);
            return parsedOutput;
        }
        catch (error) {
            console.error('Error from OpenAI:', error);
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
        const output = yield personStructureOutput(prompt);
        return res.status(200).json(output);
    });
}
app.listen(port, () => {
    console.log('API listening on port:', port);
});
//# sourceMappingURL=backend.js.map