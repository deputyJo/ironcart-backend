const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require("../models/userSchema");
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

        const user = new User({
            username: "testusername",
            password: "Xy@8kL92",
            email: "test@email.com"
        });

        await user.save();

        const foundUser = await User.findOne({ email: "test@email.com" });

        expect(foundUser).not.toBeNull();
        expect(foundUser.username).toBe("testusername");
        expect(foundUser.email).toBe("test@email.com");

    });

    test("Password should be hashed", async () => {

        const user = new User({
            username: "testusername",
            password: "Xy@8kL92",
            email: "test@email.com"
        });

        const password = user.password;

        await user.save();

        const foundUser = await User.findOne({ email: "test@email.com" }).select("+password");

        expect(user.password).not.toBe(password);
        await expect(bcrypt.compare(password, foundUser.password)).resolves.toBe(true);


    });

    test("Passwords should be unhashed - testing comparePassword function", async () => {

        const user = new User({
            username: "testusername",
            password: "Xy@8kL92",
            email: "test@email.com"
        });

        const password = user.password;

        await user.save();

        const foundUser = await User.findOne({ email: "test@email.com" }).select("+password");

        await expect(foundUser.comparePassword(password)).resolves.toBe(true);
    });


});