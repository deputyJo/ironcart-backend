const { sanitize } = require("../utils/sanitize");
const logger = require("../utils/logger");

// logger.error(`Sanitization error: ${error.message}`);
jest.mock("../utils/logger", () => ({
    error: jest.fn(),
}));

describe("Sanitizing the input", () => {


    // Email
    test("Should return a valid email - no input changes made", () => {
        expect(sanitize("email", "email@test.com")).toBe("email@test.com");
    });

    test("Should trim the email input", () => {
        expect(sanitize("email", "    email@test.com  ")).toBe("email@test.com");
    });

    test("Should remove non-leading and non-trailing spaces", () => {
        expect(sanitize("email", "em   ail@te   st.com")).toBe("email@test.com");
    });

    test("Should remove escape characters ", () => {
        expect(sanitize("email", "email@te\st.com")).toBe("email@test.com");
    });


    // Username
    test("Should return a valid username - no input changes made", () => {
        expect(sanitize("username", "testUsername")).toBe("testUsername");
    });

    test("Should remove the @", () => {
        expect(sanitize("username", "testUsern@ame")).toBe("testUsername");
    });

    test("Should trim the input ", () => {
        expect(sanitize("username", " testUsername  ")).toBe("testUsername");
    });

    test("Should remove invalid characters ", () => {
        expect(sanitize("username", "testUs';.;;'ername")).toBe("testUsername");
    });

    test("Should remove escape characters ", () => {
        expect(sanitize("username", "testUs\ername")).toBe("testUsername");
    });

    test("Should remove all types of invalid characters ", () => {
        expect(sanitize("username", "testUs\er\//.,#)(*&^%$£¬!£$%#~@:?><|';][=-name")).toBe("testUsername");
    });

    // Password
    test("Should return a valid password - no input changes made", () => {
        expect(sanitize("password", "testPassword")).toBe("testPassword");
    });

    test("Should trim the input", () => {
        expect(sanitize("password", "  testPassword   ")).toBe("testPassword");
    });

    test("Should remove non-leading and non-trailing spaces", () => {
        expect(sanitize("password", "tes  tPas    sword")).toBe("testPassword");
    });

    test("Should remove the @ character", () => {
        expect(sanitize("password", "test@Password")).toBe("testPassword");
    });


    // The Catch block
    test("Logger should log the error", () => {

        jest.spyOn(String.prototype, "trim").mockImplementation(() => {
            throw new Error("Trim error");
        });

        sanitize("username", "testInput");

        expect(logger.error).toHaveBeenCalledWith(expect.stringMatching(/Sanitization error/));

        String.prototype.trim.mockRestore();
    });


    test("When there is an error, an empty string should be returned", () => {

        jest.spyOn(String.prototype, "trim").mockImplementation(() => {
            throw new Error("Trim error");
        });

        expect(sanitize("username", "testInput")).toBe("");

        String.prototype.trim.mockRestore();
    });


})
