const { generateToken } = require("../utils/generateToken");
const jwt = require('jsonwebtoken');
const logger = require("../utils/logger");

//  Mock the logger to check for errors
jest.mock("../utils/logger", () => ({
    error: jest.fn(),
}));

describe("Generate the token", () => {
    let token;
    let userId = "12345";

    beforeEach(() => {
        token = generateToken({ _id: userId }); //  Generate a fresh token before each test
    });

    //  SUCCESS TESTS
    test("Should generate a valid token containing the correct user ID", () => {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        expect(decodedToken.id).toBe(userId);
    });

    test("The token should be a valid string", () => {
        expect(typeof token).toBe("string");
        expect(token.length).toBeGreaterThan(0);
    });

    test("The token should contain required JWT properties", () => {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        expect(decodedToken).toHaveProperty("id");
        expect(decodedToken).toHaveProperty("exp");
        expect(decodedToken).toHaveProperty("iat");
    });

    //  ERROR TESTS (Edge Cases)
    const invalidInputs = [
        { input: {}, description: "empty object" },
        { input: null, description: "null input" },
        { input: { value: "testValue" }, description: "missing _id field" },
        { input: undefined, description: "undefined input" }
    ];

    test.each(invalidInputs)(
        "Should throw an error when input is $description",
        ({ input }) => {
            expect(() => generateToken(input)).toThrow("Token generation error");
        }
    );

    test.each(invalidInputs)(
        "The logger should log an error when input is $description",
        ({ input }) => {
            expect(() => generateToken(input)).toThrow("Token generation error");
            expect(logger.error).toHaveBeenCalledWith(expect.stringMatching(/Error generating a JWT token/));
        }
    );
});
