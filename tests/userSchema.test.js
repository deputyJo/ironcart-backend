const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { User, validateUser } = require("../models/userSchema"); // Import validateUser
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;

describe("userSchema tests", () => {

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri(), { dbName: "testdb" });
    });

    afterEach(async () => {
        await User.deleteMany();
    });

    afterAll(async () => {
        await mongoose.connection.close();
        await mongoServer.stop();
    });

    test("User should be saved", async () => {
        const userData = {
            username: "testusername",
            password: "Xy@8kL92",
            email: "test@email.com"
        };

        const { error } = validateUser(userData);
        expect(error).toBeUndefined(); // Ensure the data is valid

        const user = new User(userData);
        await user.save();

        const foundUser = await User.findOne({ email: "test@email.com" });

        expect(foundUser).not.toBeNull();
        expect(foundUser.username).toBe("testusername");
        expect(foundUser.email).toBe("test@email.com");
    });

    test("Password should be hashed", async () => {
        const userData = {
            username: "testusername",
            password: "Xy@8kL92",
            email: "test@email.com"
        };

        const { error } = validateUser(userData);
        expect(error).toBeUndefined();

        const user = new User(userData);
        await user.save();

        const foundUser = await User.findOne({ email: "test@email.com" }).select("+password");

        expect(foundUser.password).not.toBe(userData.password); // Ensure password is hashed
        await expect(bcrypt.compare(userData.password, foundUser.password)).resolves.toBe(true);
    });

    test("Passwords should be unhashed - testing comparePassword function", async () => {
        const userData = {
            username: "testusername",
            password: "Xy@8kL92",
            email: "test@email.com"
        };

        const { error } = validateUser(userData);
        expect(error).toBeUndefined();

        const user = new User(userData);
        await user.save();

        const foundUser = await User.findOne({ email: "test@email.com" }).select("+password");

        expect(foundUser).not.toBeNull();
        await expect(foundUser.comparePassword("Xy@8kL92")).resolves.toBe(true); // Use actual password
    });

});
