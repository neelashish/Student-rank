/**
 * Calculate GitHub score based on repositories, stars, commits, and followers
 * Maximum theoretical score: ~1000
 */
export const calculateGitHubScore = (
    repos: number,
    stars: number,
    commits: number,
    followers: number
): number => {
    const repoScore = Math.min(repos * 2, 200); // Max 200 for 100+ repos
    const starScore = Math.min(stars * 0.5, 300); // Max 300 for 600+ stars
    const commitScore = Math.min(commits * 0.1, 400); // Max 400 for 4000+ commits
    const followerScore = Math.min(followers * 1, 100); // Max 100 for 100+ followers

    return repoScore + starScore + commitScore + followerScore;
};

/**
 * Calculate LeetCode score based on problems solved and contest rating
 * Maximum theoretical score: ~1000
 */
export const calculateLeetCodeScore = (
    easy: number,
    medium: number,
    hard: number,
    rating: number
): number => {
    const easyScore = Math.min(easy * 1, 150); // Max 150 for 150+ easy
    const mediumScore = Math.min(medium * 3, 450); // Max 450 for 150+ medium
    const hardScore = Math.min(hard * 5, 250); // Max 250 for 50+ hard
    const ratingScore = Math.min(rating * 0.15, 150); // Max 150 for 1000+ rating

    return easyScore + mediumScore + hardScore + ratingScore;
};

/**
 * Calculate HackerRank score based on stars and badges
 * Maximum theoretical score: ~500
 */
export const calculateHackerRankScore = (
    stars: number,
    badges: number
): number => {
    const starScore = Math.min(stars * 40, 400); // Max 400 for 10 stars
    const badgeScore = Math.min(badges * 10, 100); // Max 100 for 10+ badges

    return starScore + badgeScore;
};

/**
 * Calculate total weighted score
 * GitHub: 40%, LeetCode: 40%, HackerRank: 20%
 */
export const calculateTotalScore = (
    githubScore: number,
    leetcodeScore: number,
    hackerrankScore: number
): number => {
    const normalizedGithub = (githubScore / 1000) * 40;
    const normalizedLeetcode = (leetcodeScore / 1000) * 40;
    const normalizedHackerrank = (hackerrankScore / 500) * 20;

    return Math.round(normalizedGithub + normalizedLeetcode + normalizedHackerrank);
};
