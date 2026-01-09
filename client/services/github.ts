import api from './api';

export interface GitHubStats {
    repos: number;
    stars: number;
    commits: number;
    followers: number;
}

export const getGitHubStats = async (username: string): Promise<GitHubStats> => {
    // This would typically call our backend, but for now we'll call GitHub directly
    try {
        const response = await fetch(`https://api.github.com/users/${username}`);
        const data = await response.json();

        return {
            repos: data.public_repos || 0,
            stars: 0, // Would need to fetch all repos to calculate
            commits: 0,
            followers: data.followers || 0,
        };
    } catch (error) {
        throw new Error('Failed to fetch GitHub stats');
    }
};
