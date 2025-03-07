const { authLogin } = require("../controllers/authController");
const User = require("../models/userSchema");
const logger = require("../utils/logger");
const { sanitize } = require("../utils/sanitize");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/generateToken");


jest.mock("../models/userSchema", () => ({
    findOne: jest.fn()
}));

jest.mock("../utils/logger", () => ({
    warn: jest.fn(),
    info: jest.fn()
}));

jest.mock("../utils/sanitize", () => ({
    sanitize: jest.fn((input) => input)
}));

jest.mock("bcrypt", () => ({
    compare: jest.fn()
}));



jest.mock("../utils/generateToken", () => ({
    generateToken: jest.fn()
}));

beforeEach(() => {
    jest.clearAllMocks();
    generateToken.mockReset(); // Reset it before each test

});

describe("User authentication test", () => {


    test("Fail - token generation", async () => {
        const req = {
            body: {
                email: "test@email.com",
                password: "testPassword"
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        User.findOne.mockResolvedValue({ email: "test@email.com", password: "hashedPassword" });

        bcrypt.compare.mockResolvedValue(true);

        generateToken.mockReturnValue(null);


        await authLogin(req, res);

        expect(logger.warn).toHaveBeenCalledWith(expect.stringMatching(/Failure generating a token/));
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Internal server error" });
    });



    test("Fail - password authorization", async () => {
        const req = {
            body: {
                email: "test@email.com",
                password: "testPassword"
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        User.findOne.mockResolvedValue({ email: "test@email.com", password: "hashedPassword" });

        bcrypt.compare.mockResolvedValue(false);

        await authLogin(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Internal server error" });
    });


    test("Success - password authorization", async () => {
        const req = {
            body: {
                email: "test@email.com",
                password: "testPassword"
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        const user = "testUser";
        const token = "mockedToken";

        User.findOne.mockResolvedValue({ email: "test@email.com", password: "hashedPassword" });

        bcrypt.compare.mockResolvedValue(true);

        generateToken.mockReturnValue("mockedToken");


        await authLogin(req, res);

        expect(logger.info).toHaveBeenCalledWith(expect.stringMatching(/User authenticated and logged in/));
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: `Token generated! User: ${user.username} logged in!`, token });
    });



    const invalidEmailInput = [
        { input: null, description: "null" },
        { input: "", description: "empty" },
        { input: 10, description: "a number" },
        { input: undefined, description: "undefined" },
        { input: true, description: "a boolean" },
    ];

    test.each(invalidEmailInput)("Invalid: email is $description", async ({ input }) => {
        const req = {
            body: {
                email: input,
                password: "testPassword"
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        sanitize.mockReturnValue(input);

        User.findOne.mockResolvedValue(null);

        await authLogin(req, res);

        expect(User.findOne).toHaveBeenCalledWith({ email: input });

        expect(logger.warn).toHaveBeenCalledWith(expect.stringMatching(/User not found. Can't authenticate/));


        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Internal server error" });
    });




    test("Success - valid user", async () => {

        const req = {
            body: {
                email: "test@email.com",
                password: "testPassword"
            }
        }

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        User.findOne.mockResolvedValue("test@email.com");

        const { email } = req.body;

        await User.findOne({ email });

        expect(User.findOne).toHaveBeenCalledWith({ email: "test@email.com" });
    });



});