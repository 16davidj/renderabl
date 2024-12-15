import fs from 'fs';
import dotenv from 'dotenv'
import {OpenAI} from 'openai'
import { ChatCompletionMessageParam } from 'openai/resources';

dotenv.config();

export const concatenateComponentFiles = (fileDirectories : string[], directoryPath : string): string => {
  let concatenatedContent = '';
  fileDirectories.forEach(filePath => {
    const fullPath = directoryPath + "/" + filePath;
    const fileStats = fs.statSync(fullPath);

    if (fileStats.isFile() && fullPath.endsWith('.tsx')) {
      const fileContent = fs.readFileSync(fullPath, 'utf-8');
      concatenatedContent += fileContent + '\n';
    }
  });

  return concatenatedContent;
};

// agentProps should be a json representation of the struct.
export const generateComponentFile = async (directoryPath: string, agentName : string, agentProps : string, agentDescription : string, outputPath : string) : Promise<void> => {
    const fileDirectories : string[] = fs.readdirSync(directoryPath);
    const prevComponentContent = concatenateComponentFiles(fileDirectories, directoryPath);
    const prompt : ChatCompletionMessageParam = {role: "user", content: `The agent name is ${agentName}, with the following properties: ${agentProps}. This is the agent description: ${agentDescription}. This is
    a concatenated string of existing components: ${prevComponentContent}.`}
    const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY})
    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{
            role: "system",
            content: "You are a tool that helps generate UI components. You will be given the agentName, which will help with general naming, as well as the properties that will be passed in as props to the component, which should define" + 
            "the component and its UI properties. The agent description will describe the purpose of the UI component, and to what prompts it should be a response to." +
            "Lastly, a concatenatedContent string will provide a string with logic of similar components, off which this generated component should be based off of (eg. matching styling, language). Please generate the requested component. Please do not include any text besides the actual component itself." +
            "For example, the response content should not include ``` to format the test, or ```jsx to indicate the formatting of the language. The response content should be compile-able by itself, as it will be written straight to a file. The props should be included in the UI component, and should not be imported."
        }, prompt],
    })
    const content = response.choices[0].message.content;
    fs.writeFile(outputPath, content, (err) => {
        if (err) {
            console.error('Error writing to file:', err);
            return;
        } else {
            console.log('File written successfully!');
            return;
        }
    });
    return;
}

export const mutateComponentFile = async (fileLocation : string, agentName : string, userPrompt : string) : Promise<void> => {
  const fileStats = fs.statSync(fileLocation);
  if (fileStats.isFile() && fileLocation.endsWith('.tsx')) {
    const fileContent = fs.readFileSync(fileLocation, 'utf-8');
    const prompt : ChatCompletionMessageParam = {role: "user", content: `The agent name is ${agentName}. The props and UI component are defined as: ${fileContent}. The user prompt to modify the component is: ${userPrompt}.`}
    const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY})
    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{
            role: "system",
            content: "You are a tool that helps modify existing UI components. You will be passed the agent name, which gives a sense of what the component does." +
            "You will also be given the content of the UI component, which should include the properties definition, and the component itself. You will also be given the" +
            "user prompt, which will tell you how the user wants to modify the component. Please reflect any user prompt changes wherever necessary, including in the UI component itself, as well as its properties. For " +
            "example, if the user wants to add a new part of the UI component, eg. birthday, the props should reflect it, as well as the component itself. Please modify the props in the UI component itself, and do not make an extension" + 
            "of the props. Please do not include any text besides the actual component itself." + "For example, the response content should not include ``` to format the test, or ```jsx to indicate the formatting of the language. The response content should be compile-able by itself, as it will be written straight to a file."
        }, prompt],
    })
    const content = response.choices[0].message.content;
    fs.writeFile(fileLocation, content, (err) => {
        if (err) {
            console.error('Error writing to file:', err);
            return;
        } else {
            console.log('File written successfully!');
            return;
        }
    });
  }
  return;
}