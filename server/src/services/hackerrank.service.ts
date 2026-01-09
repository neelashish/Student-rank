import axios from 'axios';

interface HackerRankStats {
    stars: number;
    badges: number;
}

/**
 * Fetch HackerRank user statistics
 * Note: HackerRank doesn't have a public API, this is a simplified version
 * In production, you might need to use web scraping or a third-party service
 */
export const fetchHackerRankStats = async (username: string): Promise<HackerRankStats> => {
    try {
        // Attempt to fetch from HackerRank's internal API
        const response = await axios.get(
            `https://www.hackerrank.com/rest/hackers/${username}/scores_elo`,
            {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                },
            }
        );

        if (!response.data || response.data.status === false) {
            throw new Error(`HackerRank user '${username}' not found`);
        }

        // Extract stars from different domains
        const models = response.data.models || {};
        let totalStars = 0;
        let totalBadges = 0;

        // Count stars across all domains
        Object.values(models).forEach((domain: any) => {
            if (domain.stars) {
                totalStars += domain.stars;
            }
            if (domain.badges) {
                totalBadges += domain.badges;
            }
        });

        return {
            stars: totalStars,
            badges: totalBadges,
        };
    } catch (error: any) {
        // If API fails, return default values
        // In a real app, you might want to implement web scraping or use a paid API
        console.warn(`Could not fetch HackerRank stats for ${username}:`, error.message);

        return {
            stars: 0,
            badges: 0,
        };
    }
};
