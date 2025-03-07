//import user controller

const userController = require("../controllers/userController");
const { validateInputLengthMax } = require("../controllers/userController");
const { validateInputLengthMin } = require("../controllers/userController");
const logger = require('../utils/logger');
const User = require("../models/userSchema");
const { json } = require("express");
const { generateToken } = require("../utils/generateToken");
const { sanitize } = require("../utils/sanitize");



jest.mock("../utils/logger", () => ({
    warn: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
}));

jest.mock("../models/userSchema");

// Mock `generateToken`
jest.mock("../utils/generateToken", () => ({
    generateToken: jest.fn(),
}));


beforeEach(() => {
    jest.clearAllMocks(); // ✅ Reset mocks before each test
});

describe("User login", () => {

    test("Save uses - valid - Found user email", async () => {

        req = {
            body: {
                username: "testUsername",
                password: "testPassword",
                email: "test@email.com"
            }
        }

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        const email = "test@email.com";

        User.findOne.mockResolvedValue(email);

        await User.findOne({ email });


        expect(User.findOne).toHaveBeenCalledWith({ email: "test@email.com" });
    });


    test("Fails when user is not found", async () => {
        const { loginUser } = require("../controllers/userController");

        const req = {
            body: {
                username: "validUsername",
                password: "validPassword",
                email: "test@email.com"
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };


        User.findOne.mockResolvedValue(null);

        await loginUser(req, res);

        expect(logger.warn).toHaveBeenCalledWith(expect.stringMatching(/Can't log in user/));

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "500 Internal Server Error" });
    });





})





describe("User registration", () => {

    test("Generate token - Failure", async () => {

        req = {
            body: {
                username: "testUsername",
                password: "testPassword",
                email: "email@test.com"
            }
        }

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }


        User.findOne.mockResolvedValue(null);


        User.prototype.save = jest.fn();

        generateToken.mockImplementationOnce(() => {
            throw new Error("Token generation error");
        });

        const { registerUser } = require("../controllers/userController");

        await registerUser(req, res);

        expect(logger.error).toHaveBeenCalledWith(expect.stringMatching(/Token generation failed for user/));
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            username: "testUsername",
            email: "email@test.com"
        })

    })



    test("Generate token - Success", async () => {

        req = {
            body: {
                username: "testUsername",
                password: "testPassword",
                email: "email@test.com"
            }
        }

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }


        User.findOne.mockResolvedValue(null);


        User.prototype.save = jest.fn();

        generateToken.mockReturnValue("validToken");


        const { registerUser } = require("../controllers/userController");

        await registerUser(req, res);


        expect(logger.info).toHaveBeenCalledWith(expect.stringMatching(/User successfully registered/));
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            username: "testUsername",
            email: "email@test.com",
            token: "validToken"
        })

    })






    //Edge cases - username
    const invalidInputsUsername = [
        { input: null, description: "null" },
        { input: "", description: "empty" },
        { input: 10, description: "a number" },
        { input: undefined, description: "undefined" },
        { input: true, description: "a boolean" },
    ]


    test.each(invalidInputsUsername)("Invalid: username is $description", async ({ input }) => {

        req = {
            body: {
                username: input,
                password: "testPassword",
                email: "test@email.com"
            }
        }

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }


        User.findOne.mockResolvedValue(null);

        const { registerUser } = require("../controllers/userController");

        await registerUser(req, res);


        expect(logger.warn).toHaveBeenCalledWith(expect.stringMatching(/Invalid input/));
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Invalid input." })


    });




    //Edge cases - Password
    const invalidInputsPassword = [
        { input: null, description: "null" },
        { input: "", description: "empty" },
        { input: 10, description: "a number" },
        { input: undefined, description: "undefined" },
        { input: true, description: "a boolean" },
    ]


    test.each(invalidInputsPassword)("Invalid: password is $description", async ({ input }) => {

        req = {
            body: {
                username: "testUsername",
                password: input,
                email: "test@email.com"
            }
        }

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }


        User.findOne.mockResolvedValue(null);

        const { registerUser } = require("../controllers/userController");

        await registerUser(req, res);


        expect(logger.warn).toHaveBeenCalledWith(expect.stringMatching(/Invalid input/));
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Invalid input." })


    });



    //Edge cases - Email
    const invalidInputsEmail = [
        { input: null, description: "null" },
        { input: "", description: "empty" },
        { input: 10, description: "a number" },
        { input: undefined, description: "undefined" },
        { input: true, description: "a boolean" },
    ]


    test.each(invalidInputsEmail)("Invalid: password is $description", async ({ input }) => {

        req = {
            body: {
                username: "testUsername",
                password: "testPassword",
                email: input
            }
        }

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }


        User.findOne.mockResolvedValue(null);

        const { registerUser } = require("../controllers/userController");

        await registerUser(req, res);


        expect(logger.warn).toHaveBeenCalledWith(expect.stringMatching(/Invalid input/));
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Invalid input." })


    });



    test("Password - too long", async () => {

        req = {
            body: {
                username: "testUsername",
                password: "testPasswordOverTwevleLettersLong", // Password is too long
                email: "test@email.com"
            }
        }

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }


        User.findOne.mockResolvedValue(null);

        const { registerUser } = require("../controllers/userController");

        await registerUser(req, res);


        expect(logger.warn).toHaveBeenCalledWith(expect.stringMatching(/Invalid input: min length is 1 and max length is 12./));
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Invalid input: invalid input length." })

    });


    test("Username - too long", async () => {

        req = {
            body: {
                username: "testUsernameOverTwelveCharactersLong",   // Username is too long
                password: "testPassword",
                email: "test@email.com"
            }
        }

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }


        User.findOne.mockResolvedValue(null);

        const { registerUser } = require("../controllers/userController");

        await registerUser(req, res);


        expect(logger.warn).toHaveBeenCalledWith(expect.stringMatching(/Invalid input: min length is 1 and max length is 12./));
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Invalid input: invalid input length." })

    });



    test("Email - too short", async () => {

        req = {
            body: {
                username: "testUsername",
                password: "testPassword",
                email: "@.com"  // Password is too short
            }
        }

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }


        User.findOne.mockResolvedValue(null);

        const { registerUser } = require("../controllers/userController");

        await registerUser(req, res);


        expect(logger.warn).toHaveBeenCalledWith(expect.stringMatching(/Invalid input: min length is 6 and max length is 50./));
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Invalid input: invalid input length." })

    });



    test("Email - too long", async () => {

        req = {
            body: {
                username: "testUsername",
                password: "testPassword",
                email: "email@testOverFiftyCharactersLongTestEmailTooLong.com"  // Email is too long
            }
        }

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }


        User.findOne.mockResolvedValue(null);

        const { registerUser } = require("../controllers/userController");

        await registerUser(req, res);


        expect(logger.warn).toHaveBeenCalledWith(expect.stringMatching(/Invalid input: min length is 6 and max length is 50./));
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Invalid input: invalid input length." })

    });

    test("Saving the user - Failure", async () => {

        req = {
            body: {
                username: "testUsername",
                password: "testPassword",
                email: "email@test.com"
            }
        }

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }


        User.findOne.mockResolvedValue(null);

        //throw an error
        User.prototype.save = expect(jest.fn().mockRejectedValue(new Error("Error")));

        const { registerUser } = require("../controllers/userController");

        await registerUser(req, res);


        expect(logger.error).toHaveBeenCalledWith(expect.stringMatching(/Failure generating a user/));
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Failure generating a user." })

    })







    test("Valid - username doesn't exist", async () => {
        const email = "test@email.com";
        User.findOne.mockResolvedValue(null);

        await User.findOne({ email });

        expect(User.findOne).toHaveBeenCalledWith({ email: "test@email.com" });
    });




    test("Invalid - username exists", async () => {
        const email = "test@email.com";

        User.findOne.mockResolvedValue("test@email.com");

        const req = { body: { email } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        const { registerUser } = require("../controllers/userController");

        await registerUser(req, res);

        expect(User.findOne).toHaveBeenCalledWith({ email: "test@email.com" });
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ 'error': 'User already exists. Please sign in' });
        expect(logger.warn).toHaveBeenCalledWith(expect.stringMatching(/User already exisits/));
    });





    //Helper Functions
    describe("Validate user input", () => {

        beforeEach(() => {
            jest.clearAllMocks();
        });

        test("Valid input - Should return a truly", () => {
            expect(validateInputLengthMax("test")).toBeTruthy(); // Valid input
            expect(validateInputLengthMin("testInput")).toBeTruthy(); // Valid input
        });

        test("Invalid input - too long", () => {
            expect(validateInputLengthMax("inputOverTwelveCharactersLong")).toBeFalsy(); // Input is too long
            expect(validateInputLengthMin("inputOverFiftyCharactersLong_sceqzassvqewanezmtukjzbodbnudliabymghqspzbpohuezvy")).toBeFalsy(); // Input is too long

        });

        test("Invalid input - too short", () => {
            expect(validateInputLengthMin("input")).toBeFalsy(); // Input is too short
        });

        // Invalid - edge cases
        const invalidInputs = [
            { input: 10, description: "a number" },   // Invalid - input should be a string
            { input: null, description: "null" },
            { input: "", description: "empty" },
            { input: true, description: "boolean" },
            { input: undefined, description: "undefined" }
        ];

        test.each(invalidInputs)("Should throw an error when the input is $description", ({ input }) => {
            expect(() => validateInputLengthMax(input)).toThrow("Invalid input");
            expect(() => validateInputLengthMin(input)).toThrow("Invalid input");
        });

        // Logger
        test.each(invalidInputs)(
            "The logger should log an error when input is $description",
            ({ input }) => {

                expect(() => validateInputLengthMax(input)).toThrow("Invalid input");
                expect(() => validateInputLengthMin(input)).toThrow("Invalid input");

                expect(logger.warn).toHaveBeenCalledWith(expect.stringMatching(/Invalid input/));
                expect(logger.warn).toHaveBeenCalledTimes(2);
            }
        );

    });



});
