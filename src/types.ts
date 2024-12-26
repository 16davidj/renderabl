import { z } from "zod";

export const ParameterSchema = z.object({
  parameters: z.record(
    z.string(),
    z.object({
      type: z.union([
        z.literal("string"),
        z.literal("number"),
        z.literal("boolean"),
        z.literal("array"),
        // z.literal("object"),
      ]),
    })
  ),
});

export type Message = {
  role: 'system' | 'user' | 'assistant'
  content: string,
}

// export const generateZodSchema = (propsBody: string) => {
//   const properties: Record<string, any> = {};
//   const propertyRegex = /(\w+):\s*([^;,\n]+)\s*(?:;|\n|,|$)/g;
  
//   let match;
//   while ((match = propertyRegex.exec(propsBody))) {
//     const [, key, type] = match;
//     let zodType;

//     // Map TypeScript types to Zod types
//     switch (type.trim()) {
//       case "string":
//         zodType = z.string();
//         break;
//       case "number":
//         zodType = z.number();
//         break;
//       case "boolean":
//         zodType = z.boolean();
//         break;
//       case "string[]":
//         zodType = z.array(z.string());
//         break;
//       case "number[]":
//         zodType = z.array(z.number());
//         break;
//       case "boolean[]":
//         zodType = z.array(z.boolean());
//         break;
//       default:
//         throw new Error(`Unhandled type: ${type}`);
//     }
//     properties[key] = zodType;
//   }
//   return z.object(properties);
// };
