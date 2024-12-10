import fs from 'fs';
import dotenv from 'dotenv'
import {OpenAI} from 'openai'
import { ChatCompletionMessageParam } from 'openai/resources';

dotenv.config();


export const concatenateComponentFiles = (fileDirectories : string[], directoryPath : string): string => {
  let concatenatedContent = '';
  fileDirectories.forEach(filePath => {
    console.log(filePath)
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
    console.log(__dirname)
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
            "Lastly, a concatenatedContent string will provide a string with logic of similar components, off which this generated component should be based off of (eg. matching styling, language). Please generate the requested component. Please do not include any text besides the actual component itself."
        }, prompt],
    })
    const content = response.choices[0].message.content;
    console.log(content)
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

