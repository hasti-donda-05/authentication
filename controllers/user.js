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


        if (!req.body.user_name || !req.body.email || !req.body.mobile || !req.body.password || !req.body.confirm_password || !req.body.name) {

            return res.status(400).json({
                success: false,
                message: "please fill all the field..."
            })



        }
        else {
            if (req.body.password !== req.body.confirm_password) {
                return res.status(400).json({
                    success: false,
                    message: "password doesn't match"
                })
            }
            else {

                const isExist = await User.findOne({ email: req.body.email, mobile: req.body.mobile });
                if (isExist) {
                    return res.status(400).json({
                        success: false,
                        message: "User Already Exist"
                    })
                }
                req.body.OTP = Math.floor(Math.random() * 900000) + 100000
                req.body.otpExpiresAt = Date.now() + 5 * 60 * 1000;
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
            success: false,
            message: error.message
        });
    }
}
const verifyOTP = async (req, res) => {
    try {
        if (!req.body.id || !req.body.OTP) {
            return res.status(400).json({
                success: false,
                message: "Please enter Your id and OTP"
            })
        }
        else {
            const user = await User.findOne({ _id: req.body.id });
            console.log(user);

            // console.log("Now:", Date.now());
            // console.log("Expires:", user.tokenExpiresAt);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "Email not found"
                });
            }



            if (Date.now() > new Date(user.otpExpiresAt)) {
                user.isverify = false;
                user.OTP = null;
                user.otpExpiresAt = null;
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

            return res.status(400).json({
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
                        message: "User Verified"
                    })
                }
                else {
                    return res.status(403).json({
                        success: false,
                        message: "User is not Verified"
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
            message: error.message
        })
    }
}

const forgot_password = async (req, res) => {
    try {
        if (!req.body.email) {
            return res.status(400).json({
                success: false,
                message: "please enter email"
            })
        }
        else {
            const user = await User.findOne({ email: req.body.email });
            if (!user) {
                return res.status(404).json({
                    success: false,
                    data: user,
                    message: "Email does not Exist"
                })
            }
            user.passwordToken = Math.floor(Math.random() * 900000) + 100000
            user.tokenExpiresAt = Date.now() + 5 * 60 * 1000;

            await user.save();
          
            return res.status(200).json({
                success: true,
                message: "Token generated successfully"
            });


        }


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const reset_password = async (req, res) => {
    try {
        if (!req.body.email || !req.body.confirm_password || !req.body.new_password || !req.body.passwordToken) {
            return res.status(400).json({
                success: false,
                message: "Please fill all details"
            });
        }

        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Please enter a correct email"
            });
        }

        if (req.body.passwordToken != user.passwordToken) {
            return res.status(400).json({
                success: false,
                message: "Invalid token"
            });
        }

        if (Date.now() > user.tokenExpiresAt) {
            user.passwordToken = null;
            user.tokenExpiresAt = null;
            await user.save();
            return res.status(400).json({
                success: false,
                message: "Token has expired, please request a new one"
            });
        }

        if (req.body.new_password !== req.body.confirm_password) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match"
            });
        }
        user.password = req.body.new_password;
        user.passwordToken = null;
        user.tokenExpiresAt = null;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password Reset Successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const change_password = async (req, res) => {
    try {
        if (!req.body.email || !req.body.password || !req.body.new_password || !req.body.confirm_password) {
            res.status(400).json({
                success: false,
                message: "Please fill all field"
            })
        }
        else {

            const user = await User.findOne({ $and: [{ email: req.body.email }, { password: req.body.password }] });
            console.log(user);

            if (user) {
                if (req.body.password !== req.body.new_password) {
                    if (req.body.new_password === req.body.confirm_password) {
                        const cp = await User.findOneAndUpdate({ email: req.body.email, password: req.body.password }, { $set: { password: req.body.new_password } }, { new: true });
                        console.log(cp)
                        res.status(200).json({
                            success: true,
                            data: user,
                            message: "Password changed successfully"

                        })
                    }
                    else {
                        return res.status(400).json({
                            success: false,
                            data: user,
                            message: "Your new password and confirm password doesn't match"

                        })
                    }
                }
                else {
                    return res.status(400).json({
                        success: false,
                        message: "Your new password and password are same"

                    })
                }
            }
            else {
               return  res.status(404).json({
                    success: false,
                    message: "User Not Found"

                })
            }
        }

    } catch (error) {
       return  res.status(500).json({
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