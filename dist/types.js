"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CombinedCardStructure = exports.StringStructure = exports.PersonCardStructure = void 0;
const zod_1 = require("zod");
exports.PersonCardStructure = zod_1.z.object({
    name: zod_1.z.string(),
    summary: zod_1.z.string(),
    birthday: zod_1.z.string(),
    death: zod_1.z.string(),
    age: zod_1.z.number(),
    occupation: zod_1.z.string().describe("occupation the person is best known for in 5 words or less"),
    alma_mater: zod_1.z.string(),
    hometown: zod_1.z.string(),
    spouses: zod_1.z.array(zod_1.z.string()),
    awards: zod_1.z.array(zod_1.z.string()),
    profilePictureUrl: zod_1.z.string().optional(),
});
exports.StringStructure = zod_1.z.object({
    chat_response: zod_1.z.string().describe("response from the LLM")
});
exports.CombinedCardStructure = zod_1.z.object({
    type: zod_1.z.enum(["person", "string"]),
    data: zod_1.z.union([exports.PersonCardStructure, exports.StringStructure]),
});
//# sourceMappingURL=types.js.map