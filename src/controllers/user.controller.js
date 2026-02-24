const UserModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const  hashPassword  = require('../utils/bcrypt');
const  signToken  = require('../utils/jwt'); // Imported the new util

const registerUser = async (req, res, next) => {
    try {
        const { email, password, name } = req.body;

        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

    
        const hashedPassword = await hashPassword(password);

        const user = new UserModel({
            name,
            email,
            password: hashedPassword
        });

        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        next(error);
    }
};

const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User does not exist' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Use the utility instead of jwt.sign
        const token = signToken(user._id);

        const resUser = {
            id: user._id,
            email: user.email,
            name: user.name
        };

        return res.status(200).json({ message: 'Logged In', user: resUser, token });
    } catch (error) {
        next(error);
    }
};

module.exports = { registerUser, loginUser };
