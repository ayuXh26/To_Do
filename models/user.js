const mongoose = require('mongoose');
const validator = require('validator');
// const isEmail = require("validator/es/lib/isEmail");
const { Schema } = mongoose;

const userSchema = Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
        },
        lastName: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error('Invalid email address');
                }
            }
        },
        password: {
            type: String,
            required: true,
        }
    },
    {timestamps: true},
);

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;