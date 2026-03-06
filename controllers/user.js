import { User } from "../models/user.js";
// const Register = async (req, res) => {
//     try {
//         const user = await User.findOne()
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
        // req.body.passwordToken = Date.now()
        req.body.OTP = Math.floor(Math.random() * 900000) + 100000
        req.body.otpExpiresAt = Date.now() + 2 * 60 * 1000;

        if (!req.body.user_name || !req.body.email || !req.body.mobile || !req.body.password || !req.body.confirm_password || !req.body.name) {

            return res.status(400).json({
                success: false,
                message: "please fill alll the field..."
            })



        }
        else {
            if (req.body.password !== req.body.confirm_password) {
                return res.status(400).json({
                    status: false,
                    message: "password doesn't match"
                })
            }
            else {

                const isExist = await User.findOne({ email: req.body.email });
                if (isExist) {
                    return res.status(400).json({
                        success: false,
                        message: "User Already Exist"
                    })
                }
                const user = await User.create(req.body);
                // await user.save();   
                return res.status(201).json({
                    success: true,
                    message: "User Registered successfully"
                });


            }
        }




    } catch (error) {
        console.log(error.errors);
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
}
const verifyOTP = async (req, res) => {
    try {
        if (!req.body.email || !req.body.OTP) {
            return res.status(400).json({
                success: false,
                message: "Please enter Your Email and OTP"
            })
        }
        else {
            const user = await User.findOne({ email: req.body.email });
            console.log(user);

            // console.log("Now:", Date.now());
            // console.log("Expires:", user.tokenExpiresAt);
            if (!user) {
                return res.status(404).json({
                    success: false,

                    message: "user not found"
                });
            }



            if (Date.now() > new Date(user.otpExpiresAt).getTime()) {
                user.OTP = null;
                user.otpExpiresAt = null;
                user.passwordToken = null;
                user.tokenExpiresAt = null;
                await user.save();
                return res.status(400).json({
                    success: false,
                    message: "OTP Expired"
                });
            }
            if (req.body.OTP != user.OTP) {
                {

                    return res.status(400).json({
                        success: false,
                        message: "Invalid OTP"
                    });
                }
            }

                // user.OTP = null;
                // user.otpExpiresAt = null;

            user.isverify = true;
            await user.save();

            return res.status(200).json({
                success: true,
                message: "OTP Verified Successfully"
            });



        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
const login = async (req, res) => {
    try {
        if (!req.body.email || !req.body.password) {

            res.status(400).json({
                success: false,
                message: "please enter email and password"
            })
        }
        else {
            // const user = await User.findOne({ $and: [{ email: req.body.email }, { password: req.body.password }] });
            const user = await User.findOne({ email: req.body.email, password: req.body.password });

            console.log(user);
            if (user) {
                if (user.isverify == true) {
                    return res.status(200).json({
                        success: true,
                        data: user,
                        message: "User Found"
                    })
                }
                else {
                    return res.status(403).json({
                        success: false,
                        message: "Unverified User"
                    })
                }

            }
            else {
                res.status(404).json({
                    success: false,
                    message: "User not Found please enter valid email and password"
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

const forgot_password = async (req, res) => {
    try {
        if (!req.body.email) {
            return res.status(400).json({
                status: false,
                message: "please enter email"
            })
        }
        else {


            const user = await User.findOne({ email: req.body.email });

            if (!user) {


                return res.status(404).json({
                    status: false,
                    data: user,
                    message: "User not  found"
                })
            }
            user.passwordToken = Math.floor(Math.random() * 900000) + 100000
            user.tokenExpiresAt = Date.now() + 2 * 60 * 1000;

            await user.save();


            return res.status(200).json({
                status: true,
                message: "Reset OTP generated successfully"
            });


        }


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            message: "error"
        })
    }
}

const reset_password = async (req, res) => {
    console.log("hello")
    try {
        if (!req.body.email || !req.body.confirm_password || !req.body.new_password || !req.body.passwordToken) {
            res.status(400).json({
                success: false,
                message: "PLease Fill All Details"
            })
        }
        else {
            const user = await User.findOne({ email: req.body.email });

            if (user) {
                if (req.body.passwordToken != user.passwordToken) {
                    return res.status(400).json({ success: false, message: "Invalid token" });
                }
                if (Date.now() > new Date(user.tokenExpiresAt).getTime()) {
                    return res.status(400).json({ success: false, message: "Token expired" });
                }
                if (req.body.new_password === req.body.confirm_password) {
                    const cp = await User.findOneAndUpdate({ email: req.body.email }, { $set: { password: req.body.new_password } });
                    console.log(cp);

                    return res.status(200).json({
                        success: true,
                        message: "Done"
                    })
                }
                else {
                    return res.status(400).json({
                        success: false,
                        message: "enter correct password"
                    })
                }
            }
            else {
                res.status(404).json({
                    success: false,
                    message: "User not found"
                })
            }
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const change_password = async (req, res) => {
    try {
        if (!req.body.email || !req.body.password || !req.body.new_password) {
            res.status(400).json({
                success: false,
                message: "please enter email and password"
            })
        }
        else {

            const user = await User.findOne({ $and: [{ email: req.body.email }, { password: req.body.password }] });
            console.log(user);

            if (user) {
                const cp = await User.findOneAndUpdate({ email: req.body.email, password: req.body.password }, { $set: { password: req.body.new_password } }, { new: true });
                console.log(cp)
                res.status(200).json({
                    success: true,
                    data: user,

                    message: "Password changed successfully"

                })
            }
            else {
                res.status(404).json({
                    success: false,
                    message: "User Not Found"

                })
            }
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


const getdata = async (req, res) => {
    try {
        const user = await User.find();
        return res.status(200).json({
            data: user,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export {
    Register, login, getdata, verifyOTP, forgot_password, change_password, reset_password
};