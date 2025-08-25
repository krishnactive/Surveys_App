# SurveysApp — Connections & Data Flow

This document describes how **polling is performed**, how **data is stored**, and the connections between **Creator, Voters, Polls** with end-to-end request/response flow.

---

## 1) High-Level Architecture

```
+------------------+        HTTPS/JSON         +---------------------+        Mongoose        +------------------+
|  Browser (UI)    |  <-------------------->   |  API (Node/Express) |  <---------------->   |  MongoDB (Data)  |
|  React, Vite     |                           |  Auth, Polls, Export|                      |  Users, Polls     |
|  Tailwind, Axios |                           +---------------------+                      |  (Votes optional) |
+------------------+                                   |   uploads (images)                   +------------------+
                                                       v
                                               +------------------+
                                               |   Cloudinary     |
                                               |  (Image Store)   |
                                               +------------------+
```

---

## 2) Data Model (Entities & Relations)

```
[User] (creator) 1 ───── * [Poll]
   |                          |\
   |                          | \__ 1 ─── * [Option]
   |                          |__ 1 ─── * [Response]
   |
   └─ bookmarks  * ───── * [Poll]

[User] (voter) * ───── * [Poll]
     via Poll.voters  OR  Vote{pollId,userId,optionId}
```

### Schemas

**User**
- `_id`, username, fullName, email (unique, lowercase)
- password (bcrypt hash)
- googleId (optional, unique sparse)
- profileImageUrl (optional)
- bookmarkedPolls: [Poll._id]
- timestamps

**Poll**
- `_id`, question, type
- options: [{ _id, optionText, votes, imageUrl? }]
- responses: [{ voterId, responseText, createdAt }]
- creator: User._id
- voters: [User._id]
- closed, timestamps

**(Optional) Vote**
- pollId, userId, optionId, createdAt
- unique index on (pollId, userId)

---

## 3) API Flows

### Create Poll
```
POST /api/v1/polls
Auth → validate → save {creator=userId}
→ insert Poll
← 201 {pollId}
```

### Vote
```
POST /api/v1/polls/:id/vote {optionId}
Auth → ensure !closed
→ atomic update (add voter + inc option.votes)
← 200 updated counts
```

### Respond (Open-Ended)
```
POST /api/v1/polls/:id/respond {responseText}
Auth → ensure !closed
→ push response + add voter
← 200 appended response
```

### Bookmark
```
POST /api/v1/polls/:id/bookmark
Auth → update User.bookmarkedPolls (addToSet/pull)
← 200 OK
```

### Close & Export
```
POST /api/v1/polls/:id/close    (creator only)
GET  /api/v1/polls/:id/download?format=csv|json
```

---

## 4) Guards

- Auth required (create, vote, respond, bookmark)
- No double votes (voters array OR Vote collection)
- Reject if `closed: true`
- Only creator may close/delete
- Validation: question length, options, image type/size

---

## 5) Visual Summary

```
User (Creator) ──creates──> Poll ──has──> Options
      |                           └─has─> Responses
      └─bookmarks──> Poll

User (Voter) ──votes/responds──> Poll
      ├─ recorded in Poll.voters
      └─ (scalable) Vote {pollId,userId,optionId}
```

---

