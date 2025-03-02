const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require("../models/userSchema");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;

describe("userSchema tests", () => {

    beforeEach(async () => {
        mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri()), { dbName: "testdb" };
    });

    afterEach(async () => {
        await User.deleteMany();
    });

    afterAll(async () => {
        await mongoose.connection.close();
        await mongoServer.stop();
    });



    test("User should be saved", async () => {
        //        required: [true, 'input required'],
        // unique: true,
        //     match: [/^[a-zA-Z0-9\s]+$/, 'No special characters allowed'],
        //     maxlength: 12,
        //     minlength: 6


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

});