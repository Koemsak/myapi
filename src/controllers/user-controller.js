import Log from "../logger";
import User from "../models/User";
import bcryptjs from "bcryptjs";
import { createDecipheriv } from "crypto";

export const getAllUsers = async (req, res) => {
    let users;
    try {
        users = await User.find();
    } catch (error) {
        console.log(error);
    }

    if (!users) {
        return res.status(404).json({ status: 404, message: "User doesn't exist", data: null });
    }

    return res.status(200).json({ status: 200, message: "Successfully", data: users });
};

export const signup = async (req, res) => {
    const { name, email, password } = req.body;
    let isUserExist;
    try {
        isUserExist = await User.findOne({ email });
    } catch (error) {
        console.log(error);
    }

    if (isUserExist) {
        return res.status(400).json({ status: 400, message: "User already exist", data: null });
    }

    const hashedPassword = bcryptjs.hashSync(password);
    const user = new User({
        name,
        email,
        password: hashedPassword
    });


    try {
        await user.save();
    } catch (error) {
        console.log(error);
    }
    return res.status(201).json({ status: 201, message: "Successfully", data: user });
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    let isExist;
    try {
        isExist = await User.findOne({ email });
    } catch (error) {
        console.log(error);
    }

    if (!isExist) {
        return res.status(404).json({ status: 404, message: "Invalid user email. Please try again!", data: null });
    }

    const isPasswordCorrect = bcryptjs.compareSync(password, isExist.password);
    if (!isPasswordCorrect) {
        return res.status(400).json({ status: 400, message: "Invalid password. Please try again!", data: null });
    }
    return res.status(200).json({ status: 200, message: "Successfully", data: isExist });
}

export const wingCallback = async (req, res) => {
    const { contents } = req.body;
    Log.info(`Contents: ${contents}`);
    const password = "277a44d5ca16cd81ae9538f1269182df";
    const iv = Buffer.from(password.substring(0, 16), 'utf-8');

    const decipher = createDecipheriv('aes-256-cbc', Buffer.from(password, 'utf-8'), iv);
    let decrypted = decipher.update(Buffer.from(contents, 'base64'));
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    Log.info(`Decrypted: ${decrypted.toString('utf8')}`);
    return res.status(200).json({ status: 200, message: "Successfully", data: JSON.parse(decrypted.toString('utf8')) });
}