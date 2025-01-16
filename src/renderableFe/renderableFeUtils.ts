import fs from 'fs';
import dotenv from 'dotenv'
import {OpenAI} from 'openai'
import { ChatCompletionMessageParam } from 'openai/resources';
import { makeParseableTool, AutoParseableTool } from 'openai/lib/parser';

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

// agentArgs should be a json schema of the struct.
export const generateComponent = async (agentName : string, agentProps : string, agentDescription : string, similarComponents?: string) : Promise<string> => {
  const prompt : ChatCompletionMessageParam = {role: "user", content: `The agent name is ${agentName}. Name and create the component's props after the following provided schema: ${agentProps}.
  This is the agent description: ${agentDescription}. This is a concatenated string of existing components: ${similarComponents}.`}
  const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY})
  const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{
          role: "system",
          content: "You are a tool that helps generate UI components. You will be given the agentName, which will help with general naming, as well as the properties that will be passed in as props to the component, which should define" + 
          "the component and its UI properties. The agent description will describe the purpose of the UI component, and to what prompts it should be a response to." +
          "Lastly, a concatenatedContent string will provide a string with logic of similar components, off which this generated component should be based off of (eg. matching styling, language). Please generate the requested component. Please do not include any text besides the actual component itself." +
          "DO NOT start or end, or include ``` to format the component, or ```jsx to indicate the formatting of the language. The response content should be compile-able by itself, as it will be written straight to a file. The props should be included in the UI component, and should not be imported." + 
          "Please export the component at the end."
      }, prompt],
  })
  return response.choices[0].message.content;
}

// agentArgs should be a json schema of the struct.
export const generateComponentFile = async (directoryPath: string, agentName : string, agentProps : string, agentDescription : string, outputPath : string) : Promise<void> => {
  const fileDirectories : string[] = fs.readdirSync(directoryPath);
  const similarComponents = concatenateComponentFiles(fileDirectories, directoryPath);  
  const content : string = await generateComponent(agentName, agentProps, agentDescription, similarComponents);
  fs.writeFile(outputPath, content, async (err) => {
    if (err) {
        console.error('Error writing to file:', err);
    } else {
        console.log('File written successfully!');
    }
    return;
  });
  return;
}

export const generateToolNode = async (agentName : string, agentDescription : string, agentArgs : Record<string, unknown>, contextDataJson : string) : Promise<OpenAI.ChatCompletionTool> => {
  let contextData : Record<string, string[]>;
  try {
    contextData = JSON.parse(contextDataJson);
  } catch (error) {
    console.error("Could not parse context data: ", error);
    return;
  }

  let agentRelevantContext : Record<string, string[]>;
  const agentProperties : Record<string, any> = agentArgs.properties;
  try {
    agentRelevantContext = Object.fromEntries(
      Object.entries(contextData).filter(([key]) => key in agentProperties)
    );
  } catch (error) {
    console.error("Could not get agent relevant context from agent properties: ", error);
  }

  const description = Object.keys(agentRelevantContext).length > 0 ? agentDescription + "For context, the parameters specified for the function call can take in the following values:"
   + JSON.stringify(agentRelevantContext) + ". You can also use these values as a signal that this function could be called." : agentDescription;

  let tool : AutoParseableTool<any, any> = makeParseableTool<any>(
    {
      type: 'function',
      function: {
        name: agentName,
        parameters: agentArgs,
        // TODO: consider changing strict to true. This would require the client to
        // add all property keys to the required field, we would just have to allow null
        // as a value. see Open AI DevDay 2024 | Structured Outputs for reliable applications, 37:00 mark.
        strict: false,
        ...({ description: description }),
      },
    },
    {
      callback: undefined,
      parser: undefined
    }
  );
  return tool;
}
