import axios from 'axios';
import { env } from '../config/env';

interface GitHubUser {
    public_repos: number;
    followers: number;
    public_gists: number;
}

interface GitHubRepo {
    stargazers_count: number;
}

/**
 * Fetch GitHub user statistics
 */
export const fetchGitHubStats = async (username: string) => {
    try {
        const headers: any = {
            'Accept': 'application/vnd.github.v3+json',
        };

        // Add token if available for higher rate limits
        if (env.GITHUB_TOKEN) {
            headers['Authorization'] = `token ${env.GITHUB_TOKEN}`;
        }

        // Fetch user data
        const userResponse = await axios.get<GitHubUser>(
            `https://api.github.com/users/${username}`,
            { headers }
        );

        const userData = userResponse.data;

        // Fetch repositories to count stars
        const reposResponse = await axios.get<GitHubRepo[]>(
            `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
            { headers }
        );

        const totalStars = reposResponse.data.reduce(
            (sum, repo) => sum + repo.stargazers_count,
            0
        );

        // Fetch commit count (approximate using events)
        let totalCommits = 0;
        try {
            const eventsResponse = await axios.get(
                `https://api.github.com/users/${username}/events/public?per_page=100`,
                { headers }
            );

            totalCommits = eventsResponse.data.filter(
                (event: any) => event.type === 'PushEvent'
            ).reduce((sum: number, event: any) => {
                return sum + (event.payload?.commits?.length || 0);
            }, 0);

            // Estimate: multiply by 10 as this is just recent commits
            totalCommits = totalCommits * 10;
        } catch (error) {
            console.warn('Could not fetch commit count, using 0');
        }

        return {
            repos: userData.public_repos,
            stars: totalStars,
            commits: totalCommits,
            followers: userData.followers,
        };
    } catch (error: any) {
        if (error.response?.status === 404) {
            throw new Error(`GitHub user '${username}' not found`);
        }
        throw new Error(`Failed to fetch GitHub stats: ${error.message}`);
    }
};
