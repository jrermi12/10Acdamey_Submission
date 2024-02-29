import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import userModel from '../../model/user.model';
import { createUserInput } from '../../utils/validation/user.validation';
import NotFoundError from '../../errors/notFound.errors';
import { generateRandom8DigitString } from '../../utils/util';
import { sendMail } from '../../utils/sendMail';
import bcrypt from 'bcrypt'
import { IUserMessage } from '../../middleware/authJWT';



//@desc create  user
//@method POST  /users
//@access private
const createUser = asyncHandler(async (req: IUserMessage<{}, {}, createUserInput>, res: Response) => {
    
    const existingEmail = await userModel.findOne({ email: req.body.email })
    if (existingEmail) throw new NotFoundError("User already exists with this email")


    const password = "usher@afca"
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)
    const response = await userModel.create({
        ...req.body,
        // role: Role.REGISTRAR,
        isActive: true,
        password: hashPassword,
    })
    
    res.status(201).json({
        message: 'User created sucessfully',
        data: response,
        success: true
    });
})
export { createUser };
