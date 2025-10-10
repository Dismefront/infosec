# Лабораторная работа 1 по ИБ

Простое приложение на NodeJS, с использованием фреймворка NestJS, направленное на разработку защищенного приложения

## Что выполнено

- **Аутентификация**
  - jwt tokens
  - password hashing with bcrypt
  - protected routes

- **Защита**
  - sql injection protection with typeorm
  - xss protection
  - rate limiting
  - helmet for headers
  - input validation

- **Эндпоинты**
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

## Подробное описание мер защиты

### JWT

- Используется JWT (JSON Web Token)-аутентификация через @nestjs/passport и passport-jwt.

- При логине пользователь отправляет логин и пароль (LoginDto) в AuthController.

- AuthService проверяет данные через validateUser():

- Находит пользователя в БД.

- Проверяет пароль через bcrypt.compare() — сравнение хэша.

- Если всё верно — создаётся JWT-токен:

```javascript
const payload = { login: user.login, sub: user.id };
return { access_token: this.jwtService.sign(payload) };
```

- Токен возвращается клиенту и используется для дальнейших запросов (в Authorization: Bearer <token>).

- Доступ к защищённым маршрутам (ApiController) осуществляется через Guard JwtAuthGuard, который проверяет токен.

### Хранение паролей (bcrypt)

- При регистрации (или при создании пользователей) пароль хэшируется с солью:

```javascript
async hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}
```

- При входе используется bcrypt.compare() для проверки хэша.

### Защита от SQL Injection

- Используется TypeORM — ORM, которая под капотом использует параметризованные запросы, а не конкатенацию строк SQL.

- Например:

```javascript
const user = await this.userRepository.findOne({ where: { login } });
```

— здесь login передаётся как параметр, а не встраивается напрямую в SQL-строку.

### Защита от XSS (Cross-Site Scripting)

- В ApiController используется утилита:

```javascript
return sanitizeObject(data);
```

- Функция sanitizeObject() (судя по названию) предназначена для очистки объектов от потенциально опасных строк, например <script>...</script>.

- Обычно она делает следующее:
  - Экранирует специальные HTML-символы (<, >, ", ', &).
  - Удаляет или фильтрует подозрительные поля.
  - Рекурсивно обходит объект и чистит все строки.

### Guards и контролируемый доступ

- Для маршрута GET /api/data стоит декоратор:

```javascript
@UseGuards(JwtAuthGuard)
```

- JwtAuthGuard проверяет наличие и валидность JWT-токена через стратегию JwtStrategy

### Исключения

- Ошибки логина обрабатываются вручную:

```javascript
throw new HttpException('invalid login', HttpStatus.UNAUTHORIZED);
```

- Неверные токены, просроченные токены, и другие ошибки в Guard автоматически приводят к 401 Unauthorized.

### Хранение секретов

- JWT-секрет и expiresIn берутся из ConfigService:

```javascript
const jwtConfig = configService.get < JwtConfig > 'jwt';
```

- Конфигурация хранится отдельно (в config/jwt.config), обычно через .env файл.

### Валидация входных данных

- В AuthController:

```javascript
@Body(ValidationPipe) loginDto: LoginDto
```

- Используется встроенный ValidationPipe, который проверяет DTO на корректность (например, обязательность полей, длину и формат).

## setup

- node.js 18+ or 20+
- postgresql
- npm

## how to run

1. clone:

```bash
git clone https://github.com/Dismefront/infosec.git
cd infosec
```

2. install:

```bash
npm install
```

3. copy env:

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

5. run:

```bash
# dev mode
npm run start:dev

# build and run
npm run build
npm run start:prod
```

## Тестирование API

### Создать пользователя

Запрос

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "login": "testuser",
    "password": "password123",
    "email": "test@example.com"
  }'
```

Ответ

```bash
{
  "id":2,
  "login":"testuser",
  "email":"test@example.com",
  "isActive":true,
  "createdAt":"2025-10-10T06:35:40.550Z","updatedAt":"2025-10-10T06:35:40.550Z"
}
```

### Логин

Запрос

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "login": "testuser",
    "password": "password123"
  }'
```

Ответ

```bash
{
  "access_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6InRlc3R1c2VyIiwic3ViIjoyLCJpYXQiOjE3NjAwNzgyODAsImV4cCI6MTc2MDE2NDY4MH0.7LVQvkMQpcMDwicIeKsJE1LjB2VM13A462-HGhsWZZU"
}
```

### Получить защищенноые данные

Запрос

```bash
curl -X GET http://localhost:3000/api/data \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Ответ

```bash
{
  "id":1,
  "title":"some-title",
  "content":"some-content",
  "userId":2,
  "createdAt":"2025-10-10T06:43:34.349Z","updatedAt":"2025-10-10T06:43:34.349Z"
}
```

Пример неправильного ответа

```bash
{"message":"Unauthorized","statusCode":401}
```

## Защита

### SQL-инъекция

- typeorm
- без конкатенации строк
- валидация параметров

### Защита от xss

- обработка входных параметров
- helmet headers
- content security policy headers

### auth security

- bcrypt hashing (12 кругов)
- jwt
- валидация токенов

### Лимит запросов

- 100 запросов за 15 минут

## Команды разработчика

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

- eslint + prettier
- npm audit
- codeql
- owasp dependency check

## database

### users

- id
- login (unique)
- password (hashed)
- email
- isActive
- createdAt
- updatedAt

### posts

- id
- title
- content
- userId (fk to users)
- createdAt
- updatedAt

## Скриншоты успешной SAST/SCA проверки

![npm audit](./imgs/npmaudit.png)

![owasp check](./imgs/owasp.png)

### Скриншот отчета OWASP check

![owasp check](./imgs/dependency-check.png)
