"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSponsorLogoKey = exports.createTourLogoKey = exports.createFileKey = void 0;
const createFileKey = (agentName) => {
    return "filekey:" + agentName;
};
exports.createFileKey = createFileKey;
const createTourLogoKey = (tourName) => {
    return "tourlogo:" + tourName;
};
exports.createTourLogoKey = createTourLogoKey;
const createSponsorLogoKey = (tourName) => {
    return "sponsorlogo:" + tourName;
};
exports.createSponsorLogoKey = createSponsorLogoKey;
//# sourceMappingURL=redisUtils.js.map