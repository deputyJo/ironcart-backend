const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../server"); // Import the Express app
const User = require("../models/userSchema");
const { sanitize } = require("../utils/sanitize");

// Mock the sanitize function to prevent unwanted filtering during tests
jest.mock("../utils/sanitize", () => ({
    sanitize: jest.fn((input) => input),
}));

jest.mock("../utils/generateToken", () => ({
    generateToken: jest.fn(() => "mocked_token"),
}));

describe("User Registration", () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    afterEach(async () => {
        await User.deleteMany(); // Cleanup after each test
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    test("Should register a new user successfully", async () => {
        const newUser = {
            username: "testUser",
            email: "test@example.com",
            password: "Password123",
        };

        const response = await request(app).post("/auth/register").send(newUser);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("token");
        expect(response.body.username).toBe(newUser.username);
        expect(response.body.email).toBe(newUser.email);
    });

    test("Should not register a user with an existing email", async () => {
        const existingUser = new User({
            username: "testUser",
            email: "duplicate@example.com",
            password: "Password123",
        });
        await existingUser.save();

        const response = await request(app).post("/auth/register").send({
            username: "newUser",
            email: "duplicate@example.com",
            password: "Password123",
        });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("User already exists. Please sign in");
    });

    test("Should not register a user with an invalid email format", async () => {
        const response = await request(app).post("/auth/register").send({
            username: "testUser",
            email: "invalid-email",
            password: "Password123",
        });

        expect(response.status).toBe(400);
        expect(response.body.error).toContain("Invalid email format");
    });

    test("Should not register a user with an invalid username (special characters)", async () => {
        const response = await request(app).post("/auth/register").send({
            username: "Invalid@User",
            email: "valid@example.com",
            password: "Password123",
        });

        expect(response.status).toBe(400);
        expect(response.body.error).toContain("No special characters allowed");
    });

    test("Should not register a user with a password containing @", async () => {
        const response = await request(app).post("/auth/register").send({
            username: "validUser",
            email: "valid@example.com",
            password: "Pass@word123",
        });

        expect(response.status).toBe(400);
        expect(response.body.error).toContain("Password cannot contain @");
    });


    test("Should register a user and return a token", async () => {
        const newUser = {
            username: "testUser",
            email: "test@example.com",
            password: "Password123",
        };

        const response = await request(app).post("/auth/register").send(newUser);

        expect(response.status).toBe(201);
        expect(response.body.token).toBe("mocked_token");
    });
});
