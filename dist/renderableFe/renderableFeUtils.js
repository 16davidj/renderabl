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
exports.generateComponentFile = exports.concatenateComponentFiles = void 0;
const fs_1 = __importDefault(require("fs"));
const dotenv_1 = __importDefault(require("dotenv"));
const openai_1 = require("openai");
dotenv_1.default.config();
const concatenateComponentFiles = (fileDirectories, directoryPath) => {
    let concatenatedContent = '';
    fileDirectories.forEach(filePath => {
        console.log(filePath);
        const fullPath = directoryPath + "/" + filePath;
        const fileStats = fs_1.default.statSync(fullPath);
        if (fileStats.isFile() && fullPath.endsWith('.tsx')) {
            const fileContent = fs_1.default.readFileSync(fullPath, 'utf-8');
            concatenatedContent += fileContent + '\n';
        }
    });
    return concatenatedContent;
};
exports.concatenateComponentFiles = concatenateComponentFiles;
// agentProps should be a json representation of the struct.
const generateComponentFile = (directoryPath, agentName, agentProps, agentDescription, outputPath) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(__dirname);
    const fileDirectories = fs_1.default.readdirSync(directoryPath);
    const prevComponentContent = (0, exports.concatenateComponentFiles)(fileDirectories, directoryPath);
    const prompt = { role: "user", content: `The agent name is ${agentName}, with the following properties: ${agentProps}. This is the agent description: ${agentDescription}. This is
    a concatenated string of existing components: ${prevComponentContent}.` };
    const openai = new openai_1.OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = yield openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{
                role: "system",
                content: "You are a tool that helps generate UI components. You will be given the agentName, which will help with general naming, as well as the properties that will be passed in as props to the component, which should define" +
                    "the component and its UI properties. The agent description will describe the purpose of the UI component, and to what prompts it should be a response to." +
                    "Lastly, a concatenatedContent string will provide a string with logic of similar components, off which this generated component should be based off of (eg. matching styling, language). Please generate the requested component. Please do not include any text besides the actual component itself."
            }, prompt],
    });
    const content = response.choices[0].message.content;
    console.log(content);
    fs_1.default.writeFile(outputPath, content, (err) => {
        if (err) {
            console.error('Error writing to file:', err);
            return;
        }
        else {
            console.log('File written successfully!');
            return;
        }
    });
    return;
});
exports.generateComponentFile = generateComponentFile;
//# sourceMappingURL=renderableFeUtils.js.map