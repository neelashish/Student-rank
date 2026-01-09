import { prisma } from '../config/db';
import { fetchGitHubStats } from './github.service';
import { fetchLeetCodeStats } from './leetcode.service';
import { fetchHackerRankStats } from './hackerrank.service';
import {
    calculateGitHubScore,
    calculateLeetCodeScore,
    calculateHackerRankScore,
    calculateTotalScore,
} from '../utils/scoreFormula';

/**
 * Sync all platform stats for a user and update their total score
 */
export const syncUserStats = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { platformStats: true },
    });

    if (!user) {
        throw new Error('User not found');
    }

    let githubStats = { repos: 0, stars: 0, commits: 0, followers: 0 };
    let leetcodeStats = { solved: 0, easy: 0, medium: 0, hard: 0, rating: 0 };
    let hackerrankStats = { stars: 0, badges: 0 };

    // Fetch GitHub stats
    if (user.githubUsername) {
        try {
            githubStats = await fetchGitHubStats(user.githubUsername);
        } catch (error: any) {
            console.error(`GitHub sync failed for ${user.username}:`, error.message);
        }
    }

    // Fetch LeetCode stats
    if (user.leetcodeUsername) {
        try {
            leetcodeStats = await fetchLeetCodeStats(user.leetcodeUsername);
        } catch (error: any) {
            console.error(`LeetCode sync failed for ${user.username}:`, error.message);
        }
    }

    // Fetch HackerRank stats
    if (user.hackerrankUsername) {
        try {
            hackerrankStats = await fetchHackerRankStats(user.hackerrankUsername);
        } catch (error: any) {
            console.error(`HackerRank sync failed for ${user.username}:`, error.message);
        }
    }

    // Calculate scores
    const githubScore = calculateGitHubScore(
        githubStats.repos,
        githubStats.stars,
        githubStats.commits,
        githubStats.followers
    );

    const leetcodeScore = calculateLeetCodeScore(
        leetcodeStats.easy,
        leetcodeStats.medium,
        leetcodeStats.hard,
        leetcodeStats.rating
    );

    const hackerrankScore = calculateHackerRankScore(
        hackerrankStats.stars,
        hackerrankStats.badges
    );

    const totalScore = calculateTotalScore(githubScore, leetcodeScore, hackerrankScore);

    // Update or create platform stats
    const statsData = {
        githubRepos: githubStats.repos,
        githubStars: githubStats.stars,
        githubCommits: githubStats.commits,
        githubFollowers: githubStats.followers,
        githubScore,

        leetcodeSolved: leetcodeStats.solved,
        leetcodeEasy: leetcodeStats.easy,
        leetcodeMedium: leetcodeStats.medium,
        leetcodeHard: leetcodeStats.hard,
        leetcodeRating: leetcodeStats.rating,
        leetcodeScore,

        hackerrankStars: hackerrankStats.stars,
        hackerrankBadges: hackerrankStats.badges,
        hackerrankScore,
    };

    if (user.platformStats) {
        await prisma.platformStats.update({
            where: { userId },
            data: statsData,
        });
    } else {
        await prisma.platformStats.create({
            data: {
                userId,
                ...statsData,
            },
        });
    }

    // Update user's total score and last synced time
    await prisma.user.update({
        where: { id: userId },
        data: {
            totalScore,
            lastSyncedAt: new Date(),
        },
    });

    // Record score history for progress tracking
    await prisma.scoreHistory.create({
        data: {
            userId,
            totalScore,
            githubScore,
            leetcodeScore,
            hackerrankScore,
            rank: user.rank,
            githubRepos: githubStats.repos,
            githubStars: githubStats.stars,
            leetcodeSolved: leetcodeStats.solved,
            hackerrankStars: hackerrankStats.stars,
        },
    });

    return {
        githubScore,
        leetcodeScore,
        hackerrankScore,
        totalScore,
    };
};

/**
 * Update rankings for all users
 */
export const updateAllRankings = async () => {
    const users = await prisma.user.findMany({
        orderBy: { totalScore: 'desc' },
        select: { id: true },
    });

    for (let i = 0; i < users.length; i++) {
        await prisma.user.update({
            where: { id: users[i].id },
            data: { rank: i + 1 },
        });
    }
};
