# IronCart Backend Project

## Introduction

IronCart is a backend system ideal for an e-commerce company. It's scalable, efficient, and secure.

### The system includes:
- User authentication and authorization
- Product management
- Shopping cart and orders
- Payments (basic simulation)
- Admin dashboard (limited backend scope)
- Security and performance
- Unit and integration testing

## Installation and Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/deputyJo/ironcart-backend.git
   ```
2. Navigate to the project directory:
   ```bash
   cd ironcart-backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the server:
   ```bash
   npm start
   ```

## Technology Used
- JavaScript
- MongoDB
- Express
- Node.js

## API Documentation

### Routes:
- `/auth/register` (POST)
- `/auth/login` (POST)

### Authentication and Authorization
- All protected routes require an `Authorization` header with a **Bearer Token**.
- The token is generated during login and must be included in requests to access secure endpoints.
  ```http
  Authorization: Bearer YOUR_JWT_TOKEN
  ```

## Endpoints

### **1. Register a New User**
#### **Endpoint:**
```http
POST /auth/register
```
#### **Description:**
Registers a new user.

#### **Headers:**
```http
Content-Type: application/json
```

#### **Request Body (JSON Example):**
```json
{
  "username": "newUser",
  "password": "LnVQ0Aw&AjKk",
  "email": "user@example.com"
}
```

#### **Response Examples:**
**Success (201 - User Created)**
```json
{
  "username": "newUser",
  "email": "user@example.com",
  "token": "your_generated_jwt_token"
}
```

**Failure (400 - User Already Exists)**
```json
{
  "error": "User already exists. Please sign in"
}
```

**Failure (400 - Invalid Input)**
```json
{
  "error": "Invalid input."
}
```

**Failure (500 - Internal Server Error)**
```json
{
  "error": "Failure generating a user."
}
```

---

### **2. Login a User**
#### **Endpoint:**
```http
POST /auth/login
```
#### **Description:**
Logs in a registered user and returns a JWT token.

#### **Headers:**
```http
Content-Type: application/json
```

#### **Request Body (JSON Example):**
```json
{
  "username": "newUser",
  "password": "LnVQ0Aw&AjKk",
  "email": "user@example.com"
}
```

#### **Response Examples:**
**Success (200 - User Logged In)**
```json
{
  "message": "Token generated! User: newUser logged in!",
  "token": "your_generated_jwt_token"
}
```

**Failure (400 - Missing Email or Password)**
```json
{
  "error": "Email is required."
}
```

**Failure (400 - Invalid Email or Password)**
```json
{
  "error": "Invalid email or password."
}
```

**Failure (500 - Internal Server Error)**
```json
{
  "error": "500 Internal Server Error"
}
```

---

### **Environment Variables (.env file example)**

```env
MONGO_URL='yourMongoDBConnectionString'
JWT_SECRET_KEY='yourJWTSecretKey'
NODE_ENV=development
```

## Notes
- Ensure you replace `yourMongoDBConnectionString` and `yourJWTSecretKey` with actual values.
- Use Postman or an API testing tool to test API requests.
- Include the Bearer token in the Authorization header for protected routes.

---


