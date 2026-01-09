import axios from 'axios';

interface LeetCodeStats {
    solved: number;
    easy: number;
    medium: number;
    hard: number;
    rating: number;
}

/**
 * Fetch LeetCode user statistics using GraphQL API
 * Note: LeetCode doesn't have an official public API, this uses their GraphQL endpoint
 */
export const fetchLeetCodeStats = async (username: string): Promise<LeetCodeStats> => {
    try {
        const query = `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          username
          submitStats {
            acSubmissionNum {
              difficulty
              count
            }
          }
          profile {
            ranking
            reputation
          }
        }
      }
    `;

        const response = await axios.post(
            'https://leetcode.com/graphql',
            {
                query,
                variables: { username },
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Referer': 'https://leetcode.com',
                },
            }
        );

        const data = response.data?.data?.matchedUser;

        if (!data) {
            throw new Error(`LeetCode user '${username}' not found`);
        }

        const submissions = data.submitStats?.acSubmissionNum || [];

        const easy = submissions.find((s: any) => s.difficulty === 'Easy')?.count || 0;
        const medium = submissions.find((s: any) => s.difficulty === 'Medium')?.count || 0;
        const hard = submissions.find((s: any) => s.difficulty === 'Hard')?.count || 0;
        const total = submissions.find((s: any) => s.difficulty === 'All')?.count || 0;

        const rating = data.profile?.ranking || 0;

        return {
            solved: total,
            easy,
            medium,
            hard,
            rating,
        };
    } catch (error: any) {
        if (error.response?.status === 404 || error.message.includes('not found')) {
            throw new Error(`LeetCode user '${username}' not found`);
        }
        console.error('LeetCode API error:', error.message);
        throw new Error(`Failed to fetch LeetCode stats: ${error.message}`);
    }
};
