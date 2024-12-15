export const createFileKey = (agentName : string) : string => {
    return "filekey:" + agentName;
}

export const createTourLogoKey = (tourName : string) : string => {
    return "tourlogo:" + tourName;
}

export const createSponsorLogoKey = (tourName : string) : string => {
    return "sponsorlogo:" + tourName;
}