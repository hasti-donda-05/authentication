import { User } from "../models/user.js";
import express from 'express';
const app = express();
// const Register = async (req, res) => {
//     try {
//         const user = await User.find()
//         res.status(200).json({
//             status: true,
//             data: user,
//             message: "get Successfully"
//         })

//     } catch (error) {
//         console.log(error);
//         res.status(500).json({
//             status: false,
//             message: "savdgh"
//         })
//     }
// }

const Register = async (req, res) => {
    try {
        if (req.body.user_name != '' && req.body.email != '' && req.body.mobile != '' && req.body.password != '' && req.body.confirm_password != '' && req.body.name != '' && req.body.otp != '') {
            // console.log('hello');
            // res.status(500).json({
            // success: true,
            // message: "user sd,jbdfnmbgl exists..."
            // })
            if (req.body.password !== req.body.confirm_password) {
                // console.log('done');
                res.status(400).json({
                    status: false,
                    message: "password doesn't match"
                })
            }
            else {
                // let geterateOTP = Math.floor(Math.random())
                if (req.body.mobile.length < 10 || req.body.otp.length < 7) {
                    res.status(400).json({
                        status: false,
                        message: "Enter valid number"
                    })
                }
                else {
                    const user = await User.create(req.body);
                    res.status(200).json({
                        status: true,
                        data: user,
                        message: "successfully user register"
                    })
                }

            }
        }
        else {
            res.status(400).json({
                success: false,
                message: "please fill alll the field..."
            })
        }




    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            message: "user already exists..."
        })
    }
}

const login = async (req, res) => {
    try {
        if (!req.body.email || !req.body.password) {

            res.status(400).json({
                success: false,
                message: "User not found please enter both mobile password and email"
            })
        }
        else {
            // const user = await User.find({ $and: [{ email: req.body.email }, { password: req.body.password }] });
            const user = await User.find({ $and:[{email: req.body.email}, {password: req.body.password}] });

            console.log(user);
            if (!user) {

                res.status(404).json({
                    success: false,
                    message: "User not Found please enter valid email and password"
                })
            }
            else {
                res.status(200).json({
                    success: true,
                    data: user,
                    message: "User Found"
                })
            }
        }


        // else {
        //     const user = await User.create(req.body);
        //     res.status(200).json({
        //         success: true,
        //         data: user,
        //         message: "User Already exist"
        //     })
        // }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "savdgh"
        })
    }
}


const getdata = async (req, res) => {
    const user = await User.find();
    res.status(200).json({
        data: user,
    })
}

export {
    Register, login, getdata
};