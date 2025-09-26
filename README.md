# infosec api

a simple nestjs app with auth and some security stuff

## what it does

- **auth things**
  - jwt tokens
  - password hashing with bcrypt
  - protected routes

- **security**
  - sql injection protection with typeorm
  - xss protection
  - rate limiting
  - helmet for headers
  - input validation

- **endpoints**
  - `POST /auth/login` - login
  - `GET /api/data` - get some data (need auth)
  - `POST /users` - create user
  - `GET /users` - list users (need auth)
  - `GET /users/:id` - get user (need auth)
  - `DELETE /users/:id` - delete user (need auth)
  - `POST /posts` - create post (need auth)
  - `GET /posts` - list posts
  - `GET /posts/:id` - get post
  - `DELETE /posts/:id` - delete post (need auth)

- **ci/cd**
  - npm audit
  - owasp check
  - codeql analysis

## setup

- node.js 18+ or 20+
- postgresql
- npm

## how to run

1. clone it:
```bash
git clone https://github.com/Dismefront/infosec.git
cd infosec
```

2. install stuff:
```bash
npm install
```

3. copy env file:
```bash
cp .env.example .env
```

4. setup db in `.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_pass
DB_NAME=infosec_db
JWT_SECRET=some-secret-key
```

5. run it:
```bash
# dev mode
npm run start:dev

# build and run
npm run build
npm run start:prod
```

## testing

### create user
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "login": "testuser",
    "password": "password123",
    "email": "test@example.com"
  }'
```

### login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "login": "testuser",
    "password": "password123"
  }'
```

### get protected data
```bash
curl -X GET http://localhost:3000/api/data \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## security stuff

### sql injection
- using typeorm
- no string concatenation
- proper validation

### xss protection
- input sanitization
- helmet headers
- csp headers

### auth security
- bcrypt hashing (12 rounds)
- jwt with expiration
- token validation

### rate limiting
- 100 requests per 15 min

## dev commands

```bash
# dev mode
npm run start:dev

# tests
npm run test

# e2e tests
npm run test:e2e

# lint
npm run lint

# format
npm run format
```

## ci/cd

runs these checks:
- eslint + prettier
- npm audit
- codeql
- owasp dependency check

## database

### users table
- id
- login (unique)
- password (hashed)
- email
- isActive
- createdAt
- updatedAt

### posts table
- id
- title
- content
- userId (fk to users)
- createdAt
- updatedAt

## notes

- use strong jwt secrets in production
- configure postgres properly
- use https in production
- update dependencies regularly