# Database Schema

## Tables

### College
Stores information about educational institutions.

```prisma
model College {
  id        String   @id @default(cuid())
  name      String   @unique
  city      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  users     User[]
}
```

**Fields:**
- `id` - Unique identifier
- `name` - College name (unique)
- `city` - City location
- `users` - Related users

---

### User
Stores user account information and platform usernames.

```prisma
model User {
  id                 String   @id @default(cuid())
  name               String
  email              String   @unique
  password           String
  username           String   @unique
  collegeId          String
  githubUsername     String?
  leetcodeUsername   String?
  hackerrankUsername String?
  linkedinUrl        String?
  totalScore         Float    @default(0)
  rank               Int?
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
  lastSyncedAt       DateTime?
  
  college            College  @relation(fields: [collegeId], references: [id])
  platformStats      PlatformStats?
}
```

**Fields:**
- `id` - Unique identifier
- `name` - Full name
- `email` - Email address (unique, for login)
- `password` - Hashed password
- `username` - Unique username (public profile URL)
- `collegeId` - Reference to College
- `githubUsername` - GitHub username
- `leetcodeUsername` - LeetCode username
- `hackerrankUsername` - HackerRank username
- `linkedinUrl` - LinkedIn profile URL
- `totalScore` - Calculated total score (0-100)
- `rank` - Global rank position
- `lastSyncedAt` - Last time stats were synced

**Indexes:**
- `collegeId` - For filtering by college
- `totalScore` - For leaderboard sorting
- `username` - For profile lookups

---

### PlatformStats
Stores detailed statistics from each coding platform.

```prisma
model PlatformStats {
  id                  String   @id @default(cuid())
  userId              String   @unique
  
  // GitHub stats
  githubRepos         Int      @default(0)
  githubStars         Int      @default(0)
  githubCommits       Int      @default(0)
  githubFollowers     Int      @default(0)
  githubScore         Float    @default(0)
  
  // LeetCode stats
  leetcodeSolved      Int      @default(0)
  leetcodeEasy        Int      @default(0)
  leetcodeMedium      Int      @default(0)
  leetcodeHard        Int      @default(0)
  leetcodeRating      Int      @default(0)
  leetcodeScore       Float    @default(0)
  
  // HackerRank stats
  hackerrankStars     Int      @default(0)
  hackerrankBadges    Int      @default(0)
  hackerrankScore     Float    @default(0)
  
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
  
  user                User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

**GitHub Fields:**
- `githubRepos` - Number of public repositories
- `githubStars` - Total stars across all repos
- `githubCommits` - Estimated commit count
- `githubFollowers` - Number of followers
- `githubScore` - Calculated GitHub score (0-1000)

**LeetCode Fields:**
- `leetcodeSolved` - Total problems solved
- `leetcodeEasy/Medium/Hard` - Problems by difficulty
- `leetcodeRating` - Contest rating
- `leetcodeScore` - Calculated LeetCode score (0-1000)

**HackerRank Fields:**
- `hackerrankStars` - Total stars earned
- `hackerrankBadges` - Number of badges
- `hackerrankScore` - Calculated HackerRank score (0-500)

---

## Relationships

```
College 1----* User
User 1----1 PlatformStats
```

## Scoring System

**Total Score Calculation:**
```
githubNormalized = (githubScore / 1000) * 40
leetcodeNormalized = (leetcodeScore / 1000) * 40
hackerrankNormalized = (hackerrankScore / 500) * 20

totalScore = githubNormalized + leetcodeNormalized + hackerrankNormalized
// Range: 0-100
```

**Weight Distribution:**
- GitHub: 40%
- LeetCode: 40%
- HackerRank: 20%
