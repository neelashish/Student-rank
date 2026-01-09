# API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Auth Endpoints

### Register User
**POST** `/auth/register`

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "username": "johndoe",
  "collegeId": "college-id-here"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": { ... },
  "token": "jwt-token-here"
}
```

### Login
**POST** `/auth/login`

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": { ... },
  "token": "jwt-token-here"
}
```

---

## User Endpoints

### Get Current User
**GET** `/users/me` 🔒

**Response:**
```json
{
  "id": "user-id",
  "name": "John Doe",
  "email": "john@example.com",
  "username": "johndoe",
  "totalScore": 75,
  "rank": 5,
  "college": { ... },
  "platformStats": { ... }
}
```

### Get User by Username
**GET** `/users/:username`

**Response:** Same as above (without email)

### Update Profile
**PUT** `/users/profile` 🔒

**Body:**
```json
{
  "name": "John Updated",
  "linkedinUrl": "https://linkedin.com/in/johndoe"
}
```

### Connect Platforms
**POST** `/users/connect-platforms` 🔒

**Body:**
```json
{
  "githubUsername": "johndoe",
  "leetcodeUsername": "john_doe",
  "hackerrankUsername": "johndoe"
}
```

**Response:**
```json
{
  "message": "Platforms connected and stats synced successfully",
  "scores": {
    "githubScore": 450,
    "leetcodeScore": 520,
    "hackerrankScore": 120,
    "totalScore": 75
  }
}
```

### Sync Stats
**POST** `/users/sync` 🔒

Manually trigger stats sync for current user.

---

## Leaderboard Endpoints

### Get Global Leaderboard
**GET** `/leaderboard?limit=50&offset=0&collegeId=optional`

**Response:**
```json
{
  "users": [
    {
      "id": "user-id",
      "name": "John Doe",
      "username": "johndoe",
      "totalScore": 85,
      "rank": 1,
      "college": { ... },
      "platformStats": {
        "githubScore": 450,
        "leetcodeScore": 520,
        "hackerrankScore": 120
      }
    }
  ],
  "total": 150,
  "limit": 50,
  "offset": 0
}
```

### Get College Leaderboard
**GET** `/leaderboard/college/:collegeId?limit=50&offset=0`

**Response:**
```json
{
  "college": { ... },
  "users": [ ... ],
  "total": 45,
  "limit": 50,
  "offset": 0
}
```

---

## College Endpoints

### Get All Colleges
**GET** `/colleges`

**Response:**
```json
[
  {
    "id": "college-id",
    "name": "MIT",
    "city": "Cambridge",
    "_count": { "users": 234 }
  }
]
```

### Get College by ID
**GET** `/colleges/:id`

### Create College
**POST** `/colleges`

**Body:**
```json
{
  "name": "Harvard University",
  "city": "Cambridge"
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message here",
  "details": [ ... ] // Optional, for validation errors
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request / Validation Error
- `401` - Unauthorized
- `404` - Not Found
- `409` - Conflict (duplicate)
- `500` - Internal Server Error
