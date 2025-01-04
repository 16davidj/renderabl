"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryJobSchema = exports.cellNamesArray = exports.cronJobNamesArray = void 0;
const zod_1 = require("zod");
// Array of all cronJobNames
exports.cronJobNamesArray = [
    "SampleJob",
    "IndexingPipeline",
    "RankSignals",
    "BackfillDump",
    "ExportSequence",
];
// Array of all cellNames
exports.cellNamesArray = [
    "ax",
    "bu",
    "st",
    "si",
    "pt",
    "ad",
    "nm",
    "qx",
    "yz",
    "ym",
    "fd",
];
const FilterJobSchema = zod_1.z.object({
    field: zod_1.z.enum([
        "durationMin", "createdAt", "name", "cell", "success", "resourceUsage"
    ]),
    operator: zod_1.z.enum(["<", ">", "before", "after", "equals", "notEquals"]),
    value: zod_1.z.union([zod_1.z.string(), zod_1.z.boolean(), zod_1.z.number(), zod_1.z.string().datetime()]), // Allow string, boolean, number, or datetime
});
// Define possible sorting fields and orders
const SortJobSchema = zod_1.z.object({
    field: zod_1.z.enum(["createdAt", "durationMin", "resourceUsage"]),
    order: zod_1.z.enum(["asc", "desc"]),
});
// Main query schema that combines filters, sorting, and pagination
exports.QueryJobSchema = zod_1.z.object({
    filters: zod_1.z.array(FilterJobSchema).optional(),
    sort: SortJobSchema.optional(),
    limit: zod_1.z.number().int().optional(),
});
//# sourceMappingURL=types.js.map