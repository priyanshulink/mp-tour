import {
    monasteries,
    getSects,
    getMonasteriesBySect,
    getMonasteriesByLocation,
    findMonasteryByName
} from '../data/monasteryData';

/**
 * Offline chatbot logic using keyword matching and pattern recognition
 * @param {string} message - User's message
 * @returns {string} - Bot's response
 */
export const getOfflineResponse = (message) => {
    const lowerMessage = message.toLowerCase().trim();

    // Greeting patterns
    if (/^(hi|hello|hey|namaste|greetings)/i.test(lowerMessage)) {
        return "🙏 **Namaste! Welcome to Madhya Pradesh Heritage Guide**\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n📚 **What I Can Help You With:**\n\n🏛️ **Heritage Site Information**\n   • Details about temples, forts, and monuments\n   • History, architecture & significance\n   • Founding dates & key facts\n\n🎯 **Search Options**\n   • By name: \"Tell me about Khajuraho\"\n   • By type: \"Show Hindu temples\"\n   • By location: \"Sites in Ujjain\"\n   • Special queries: \"What's the oldest site?\"\n\n📋 **Quick Commands**\n   • \"List all sites\"\n   • \"How many sites?\"\n   • \"Help\" - See full guide\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n💡 Ask me anything about MP's heritage!";
    }

    // Help patterns
    if (/\b(help|what can you|how do|guide)\b/i.test(lowerMessage)) {
        return "📖 **COMPLETE GUIDE - MP Heritage Chatbot**\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n🔍 **SEARCH BY SITE**\n   Examples:\n   • \"Tell me about Khajuraho Temples\"\n   • \"History of Gwalior Fort\"\n   • \"Where is Sanchi located?\"\n   • \"When was Taj-ul-Masajid built?\"\n\n🎯 **SEARCH BY CATEGORY**\n\n   📿 By Type/Sect:\n   • \"Show Hindu temples\"\n   • \"List Buddhist sites\"\n   • \"Which historical monuments are there?\"\n\n   📍 By Location:\n   • \"Sites in Ujjain\"\n   • \"Khajuraho temples\"\n   • \"Monuments in Mandu\"\n\n   📅 By History:\n   • \"What's the oldest site?\"\n   • \"Which is the newest?\"\n\n📊 **STATISTICS & LISTS**\n   • \"How many sites?\"\n   • \"List all sites\"\n   • \"Count by type\"\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n💬 Just ask naturally - I'll understand!";
    }

    // List all monasteries (now sites)
    if (/\b(list|show|all|every)\b.*\b(monastery|monasteries|site|sites|temple|temples)\b/i.test(lowerMessage)) {
        const hinduList = monasteries.filter(m => m.sect.includes('Hindu'));
        const buddhistList = monasteries.filter(m => m.sect.includes('Buddhist'));
        const historicalList = monasteries.filter(m => m.sect.includes('Historical'));

        let response = "🏛️ **COMPLETE HERITAGE DIRECTORY**\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

        if (hinduList.length > 0) {
            response += `🛕 **HINDU TEMPLES**:\n`;
            hinduList.forEach((m, i) => {
                response += `${i + 1}. **${m.name}** (${m.location})\n`;
            });
            response += `\n`;
        }

        if (buddhistList.length > 0) {
            response += `☸️ **BUDDHIST SITES**:\n`;
            buddhistList.forEach((m, i) => {
                response += `${i + 1}. **${m.name}** (${m.location})\n`;
            });
            response += `\n`;
        }

        if (historicalList.length > 0) {
            response += `🏰 **HISTORICAL MONUMENTS**:\n`;
            historicalList.forEach((m, i) => {
                response += `${i + 1}. **${m.name}** (${m.location})\n`;
            });
            response += `\n`;
        }

        response += "━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
        response += `📊 **Total: ${monasteries.length} Sites**\n\n💡 Ask about any specific site for detailed information!`;

        return response;
    }

    // Sect/Type-based queries
    const sectMatch = lowerMessage.match(/\b(hindu|buddhist|jain|historical|islamic)\b/i);
    if (sectMatch || /\b(sect|type|category)\b/i.test(lowerMessage)) {
        if (sectMatch) {
            const sect = sectMatch[1];
            // Filter partially matching sect string
            const filtered = monasteries.filter(m => m.sect.toLowerCase().includes(sect.toLowerCase()));

            if (filtered.length > 0) {
                let response = `🏷️ **${sect.toUpperCase()} SITES**\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
                response += `Found ${filtered.length} sites:\n\n`;

                filtered.forEach((m, i) => {
                    response += `${i + 1}. **${m.name}**\n`;
                    response += `   📍 Location: ${m.location}\n`;
                    response += `   📅 Founded: ${m.founded}\n`;
                    response += `   📜 ${m.history.substring(0, 100)}...\n\n`;
                });

                response += "━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
                response += `💡 Ask for more details about any of these!`;
                return response;
            }
        }
        // General sect info
        const sects = getSects();
        let response = "🏷️ **HERITAGE CATEGORIES IN MP**\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

        sects.forEach(s => {
            const count = getMonasteriesBySect(s).length;
            response += `**${s}:** ${count} sites\n`;
        });

        response += "\n━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
        response += "💡 Ask: \"Show Hindu temples\" or \"List Historical monuments\"";
        return response;
    }

    // Location-based queries
    const locationKeywords = ['bhopal', 'ujjain', 'khajuraho', 'gwalior', 'orchha', 'mandu', 'sanchi', 'raisen', 'dhar'];
    const locationMatch = locationKeywords.find(loc => lowerMessage.includes(loc));

    if (locationMatch || /\b(where|location|place|area|city)\b/i.test(lowerMessage)) {
        if (locationMatch) {
            const filtered = getMonasteriesByLocation(locationMatch);
            if (filtered.length > 0) {
                const locationName = locationMatch.charAt(0).toUpperCase() + locationMatch.slice(1);
                let response = `📍 **SITES IN ${locationName.toUpperCase()}**\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
                response += `Found ${filtered.length} site(s):\n\n`;

                filtered.forEach((m, i) => {
                    response += `${i + 1}. **${m.name}**\n`;
                    response += `   📍 ${m.location}\n`;
                    response += `   🏷️ Type: ${m.sect}\n`;
                    response += `   📜 ${m.history}\n\n`;
                });

                response += "━━━━━━━━━━━━━━━━━━━━━━━━━━━";
                return response;
            }
        }
    }

    // Oldest/newest queries
    if (/\b(oldest|first|earliest)\b/i.test(lowerMessage)) {
        // Custom logic for MP data if needed, or rely on simple parsing. 
        // Since 'founded' format varies (3rd century BCE, 950-1050 CE), simple parsing is hard.
        // Hardcoding known oldest for MP context or doing a best effort.
        // Sanchi (3rd century BCE) and Bhimbetka (Paleolithic) are oldest.
        const oldest = monasteries.find(m => m.name.includes("Bhimbetka")) || monasteries[0];
        return `🏛️ **THE OLDEST SITE**\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n**${oldest.name}**\n\n📅 **Founded:** ${oldest.founded}\n📍 **Location:** ${oldest.location}\n🏷️ **Type:** ${oldest.sect}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n📜 **SIGNIFICANCE:**\n\n${oldest.history}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n💡 This site represents some of the earliest traces of human life or civilization in the region.`;
    }

    // Specific monastery (site) name search
    const siteKeywords = [
        'khajuraho', 'mahakaleshwar', 'omkareshwar', 'sanchi', 'gwalior',
        'orchha', 'jahaz', 'bhimbetka', 'kandariya', 'udayagiri', 'bhojpur',
        'chaturbhuj', 'dhar', 'mandu', 'sonagiri'
    ];

    const foundName = siteKeywords.find(name => lowerMessage.includes(name));
    if (foundName) {
        const site = findMonasteryByName(foundName);
        if (site) {
            return `🏛️ **${site.name.toUpperCase()}**\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n📋 **BASIC INFORMATION:**\n\n📍 Location: ${site.location}\n🏷️ Type: ${site.sect}\n📅 Founded: ${site.founded}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n📜 **HISTORICAL BACKGROUND:**\n\n${site.history}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n🔗 [Read detailed article on Wikipedia](${site.wiki})\n\n💡 Ask me for more details!`;
        }
    }

    // Default fallback
    return `❓ **I'M NOT SURE ABOUT THAT**\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n📚 In **Offline Mode**, I can help you with:\n\n🔍 **SPECIFIC SITES:**\n   • \"Tell me about Khajuraho\"\n   • \"History of Sanchi Stupa\"\n   • \"Where is Mahakaleshwar?\"\n\n📊 **CATEGORY SEARCHES:**\n   • \"Show Hindu temples\"\n   • \"Sites in Gwalior\"\n   • \"List all sites\"\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n💡 **TIPS:**\n\n• Type \"help\" for complete guide\n• Switch to **Online Mode** 🤖 for AI-powered responses\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
};
