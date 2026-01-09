export interface PlatformStats {
    githubRepos: number;
    githubStars: number;
    githubCommits: number;
    githubFollowers: number;
    githubScore: number;

    leetcodeSolved: number;
    leetcodeEasy: number;
    leetcodeMedium: number;
    leetcodeHard: number;
    leetcodeRating: number;
    leetcodeScore: number;

    hackerrankStars: number;
    hackerrankBadges: number;
    hackerrankScore: number;
}

export interface ScoreBreakdown {
    githubScore: number;
    leetcodeScore: number;
    hackerrankScore: number;
    totalScore: number;
}
