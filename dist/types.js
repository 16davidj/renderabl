"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParameterSchema = void 0;
const zod_1 = require("zod");
exports.ParameterSchema = zod_1.z.object({
    parameters: zod_1.z.record(zod_1.z.string(), zod_1.z.object({
        type: zod_1.z.union([
            zod_1.z.literal("string"),
            zod_1.z.literal("number"),
            zod_1.z.literal("boolean"),
            zod_1.z.literal("array"),
            // z.literal("object"),
        ]),
    })),
});
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
//# sourceMappingURL=types.js.map