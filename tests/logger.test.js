const logger = require("../utils/logger");
const winston = require("winston");

describe("Logger", () => {
    beforeEach(() => {
        jest.restoreAllMocks(); // Reset mocks before each test
    });

    test("Succesfull logging", () => {
        jest.spyOn(logger, "warn").mockImplementation(() => { });

        logger.warn("User already exists");

        expect(logger.warn).toHaveBeenCalledWith("User already exists");
    });

});
