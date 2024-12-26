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
exports.generateToolNode = exports.mutateComponentFile = exports.generateComponentFile = exports.generateComponent = exports.concatenateComponentFiles = void 0;
const fs_1 = __importDefault(require("fs"));
const dotenv_1 = __importDefault(require("dotenv"));
const openai_1 = require("openai");
const parser_1 = require("openai/lib/parser");
dotenv_1.default.config();
const concatenateComponentFiles = (fileDirectories, directoryPath) => {
    let concatenatedContent = '';
    fileDirectories.forEach(filePath => {
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
// async function getComponentProps(filePath: string) {
//   const fileContent = fs.readFileSync(filePath, "utf-8");
//   // Extract the `export type GolfBallCardProps` definition
//   const propsRegex = /export type (\w+Props) = ({[\s\S]*?});/;
//   const match = fileContent.match(propsRegex);
//   if (match) {
//     const [, name, props] = match;
//     console.log(`Props Name: ${name}`);
//     console.log(`Props Definition: ${props}`);
//     return { name, props };
//   }
//   throw new Error("Props definition not found in the file.");
// }
// agentArgs should be a json schema of the struct.
const generateComponent = (agentName, agentProps, agentDescription, similarComponents) => __awaiter(void 0, void 0, void 0, function* () {
    const prompt = { role: "user", content: `The agent name is ${agentName}. Name and create the component's props after the following provided schema: ${agentProps}.
  This is the agent description: ${agentDescription}. This is a concatenated string of existing components: ${similarComponents}.` };
    const openai = new openai_1.OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = yield openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{
                role: "system",
                content: "You are a tool that helps generate UI components. You will be given the agentName, which will help with general naming, as well as the properties that will be passed in as props to the component, which should define" +
                    "the component and its UI properties. The agent description will describe the purpose of the UI component, and to what prompts it should be a response to." +
                    "Lastly, a concatenatedContent string will provide a string with logic of similar components, off which this generated component should be based off of (eg. matching styling, language). Please generate the requested component. Please do not include any text besides the actual component itself." +
                    "DO NOT start or end, or include ``` to format the component, or ```jsx to indicate the formatting of the language. The response content should be compile-able by itself, as it will be written straight to a file. The props should be included in the UI component, and should not be imported." +
                    "Please include any import statements that may be necessary, and use the context of the other components to figure out where the components are imported from.."
            }, prompt],
    });
    return response.choices[0].message.content;
});
exports.generateComponent = generateComponent;
// agentArgs should be a json schema of the struct.
const generateComponentFile = (directoryPath, agentName, agentProps, agentDescription, outputPath) => __awaiter(void 0, void 0, void 0, function* () {
    const fileDirectories = fs_1.default.readdirSync(directoryPath);
    const similarComponents = (0, exports.concatenateComponentFiles)(fileDirectories, directoryPath);
    const content = yield (0, exports.generateComponent)(agentName, agentProps, agentDescription, similarComponents);
    fs_1.default.writeFile(outputPath, content, (err) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            console.error('Error writing to file:', err);
            return;
        }
        else {
            console.log('File written successfully!');
            // const componentProps = getComponentProps(outputPath);
            // const zodSchema = generateZodSchema((await componentProps).props);
            // console.log("zodSchema", zodSchema);
            return;
        }
    }));
    return;
});
exports.generateComponentFile = generateComponentFile;
const mutateComponentFile = (fileLocation, agentName, userPrompt) => __awaiter(void 0, void 0, void 0, function* () {
    const fileStats = fs_1.default.statSync(fileLocation);
    if (fileStats.isFile() && fileLocation.endsWith('.tsx')) {
        const fileContent = fs_1.default.readFileSync(fileLocation, 'utf-8');
        const prompt = { role: "user", content: `The agent name is ${agentName}. The props and UI component are defined as: ${fileContent}. The user prompt to modify the component is: ${userPrompt}.` };
        const openai = new openai_1.OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const response = yield openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{
                    role: "system",
                    content: "You are a tool that helps modify existing UI components. You will be passed the agent name, which gives a sense of what the component does." +
                        "You will also be given the content of the UI component, which should include the properties definition, and the component itself. You will also be given the" +
                        "user prompt, which will tell you how the user wants to modify the component. Please reflect any user prompt changes wherever necessary, including in the UI component itself, as well as its properties. For " +
                        "example, if the user wants to add a new part of the UI component, eg. birthday, the props should reflect it, as well as the component itself. Please modify the props in the UI component itself, and do not make an extension" +
                        "of the props. Please do not include any text besides the actual component itself." + "For example, the response content should not include ``` to format the test, or ```jsx to indicate the formatting of the language. The response content should be compile-able by itself, as it will be written straight to a file."
                }, prompt],
        });
        const content = response.choices[0].message.content;
        fs_1.default.writeFile(fileLocation, content, (err) => {
            if (err) {
                console.error('Error writing to file:', err);
                return;
            }
            else {
                console.log('File written successfully!');
                return;
            }
        });
    }
    return;
});
exports.mutateComponentFile = mutateComponentFile;
const generateToolNode = (agentName, agentDescription, agentArgs, contextDataJson) => __awaiter(void 0, void 0, void 0, function* () {
    let parameters = agentArgs;
    let contextData;
    try {
        parameters = agentArgs;
        contextData = JSON.parse(contextDataJson);
    }
    catch (error) {
        console.error("could not parse context data: ", error);
        return;
    }
    let agentRelevantContext;
    const agentProperties = agentArgs.properties;
    try {
        agentRelevantContext = Object.fromEntries(Object.entries(contextData).filter(([key]) => key in agentProperties));
    }
    catch (error) {
        console.error("could not get agent relevant context from agent properties: ", error);
    }
    const description = agentDescription + "For context, the parameters specified for the function call can take in the following values:"
        + JSON.stringify(agentRelevantContext) + ". You can also use these values as a signal that this function could be called.";
    console.log("agentDescription", agentDescription);
    let tool = (0, parser_1.makeParseableTool)({
        type: 'function',
        function: Object.assign({ name: agentName, parameters: parameters, 
            // TODO: consider changing strict to true. This would require the client to
            // add all property keys to the required field, we would just have to allow null
            // as a value. see Open AI DevDay 2024 | Structured Outputs for reliable applications, 37:00 mark.
            strict: false }, ({ description: description })),
    }, {
        callback: undefined,
        parser: undefined
    });
    console.log("Newly created tool: ", JSON.stringify(tool));
    return tool;
});
exports.generateToolNode = generateToolNode;
//# sourceMappingURL=renderableFeUtils.js.map