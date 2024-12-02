"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonCardStructure = void 0;
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
//# sourceMappingURL=types.js.map