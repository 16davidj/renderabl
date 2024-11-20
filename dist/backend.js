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
function postCall(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const prompt = req.body.messages;
        if (!req.is('application/json')) {
            return res.status(400).json({ error: 'Invalid request body' });
        }
        if (!prompt) {
            return res.status(400).json({ error: "Prompt is required" });
        }
        try {
            const response = yield openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [{
                        role: "system",
                        content: "You are a helpful assistant as a chatbot, responding to user input."
                    }, ...prompt.map(message => ({
                        role: message.sender,
                        content: message.text
                    }))]
            });
            const result = response.choices[0].message.content;
            return res.status(200).json({ body: result });
        }
        catch (error) {
            console.error('Error from OpenAI:', error);
            return res.status(500).json({ error: "Call to OpenAI failed." });
        }
    });
}
app.listen(port, () => {
    console.log('API listening on port:', port);
});
//# sourceMappingURL=backend.js.map