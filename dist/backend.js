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
const dotenv_1 = __importDefault(require("dotenv"));
// Fake DB. Assume that this would be a network call in a real product
const imageMap = new Map([
    ["Nelson Mandela", "https://hips.hearstapps.com/hmg-prod/images/_photo-by-per-anders-petterssongetty-images.jpg?crop=1.00xw:1.00xh;0,0&resize=1200:*"],
    ["Gordon Ramsay", "https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/319794_v9_bb.jpg"],
    ["Simone Biles", "https://img.olympics.com/images/image/private/t_1-1_300/f_auto/primary/bpg1hewhmku06znwbbnk"]
]);
const app = (0, express_1.default)();
const port = process.env.PORT || 5500;
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
// TODO: interface this function by type instead of doing function calling
function personStructureOutput(prompt) {
    return __awaiter(this, void 0, void 0, function* () {
        let res;
        try {
            const response = yield openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [{
                        role: "system",
                        content: "You are a helpful assistant."
                    }, ...prompt],
                response_format: (0, zod_1.zodResponseFormat)(types_1.PersonCardStructure, "combined_structure"),
            });
            const result = response.choices[0].message.content;
            try {
                const parsedOutput = JSON.parse(result);
                if (parsedOutput.name) {
                    // This would be an internal call in the companies API
                    parsedOutput.profilePictureUrl = imageMap.get(parsedOutput.name);
                }
                return parsedOutput;
            }
            catch (parsingError) {
                console.warn('Parsing error:', parsingError);
            }
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