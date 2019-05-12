const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AdminUser = require("../Models/adminUserModel");
const registrationValidator = require("../validator/registrationValidator");
const validateLoginInput = require("../validator/loginValidator");
const { catchError } = require("../utils/error");
const { PENDING, ACTIVE } = require("../utils/accountStatus");

module.exports = {
    async register(req, res) {

        console.log(req.body);
        const { name, email, password, confirmPassword } = req.body;
        const { errors, isValid } = registrationValidator({
            name,
            email,
            password,
            confirmPassword
        });

        if (!isValid) {
            return res.status(400).json(errors);
        } else {
            try {
                const findUser = await AdminUser.findOne({ email });
                if (findUser) {
                    errors.email = "Email Already exits";
                    return res.status(400).json(errors);
                }
                const activeToken = jwt.sign({ name, email }, "SECRET", {
                    expiresIn: "1d"
                });
                bcrypt.hash(password, 11, async (err, hash) => {
                    if (err) return catchError(res, err);

                    let user = new AdminUser({
                        name,
                        email,
                        password: hash,
                        accountStatus: PENDING,
                        isActivated: false,
                        activateToken: activeToken
                    });
                    const newUser = await user.save();



                    res.status(201).json({
                        message: "user created successfully",
                        activateLink: `http:/localhost:4000/api/users/activateaccount/${
                            newUser.activateToken
                            }`,
                        user: {
                            _id: newUser._id,
                            name: newUser.name,
                            email: newUser.email
                        }
                    });
                });

            } catch (error) {
                return catchError(res, error);
            }
        }
    },
    async login(req, res) {
        const { errors, isValid } = validateLoginInput(req.body);

        // Check Validation
        if (!isValid) {
            return res.status(400).json(errors);
        }

        const email = req.body.email;
        const password = req.body.password;

        const findUser = await AdminUser.findOne({ email: email });

        if (!findUser) {
            errors.email = "email don't found";
            return res.status(400).json(errors);
        }

        const checkPassword = await bcrypt.compare(password, findUser.password);

        if (checkPassword) {
            let payload = {
                id: findUser._id,
                name: findUser.name,
                email: findUser.email
            };
            let token = jwt.sign(payload, process.env.SECRET, { expiresIn: "1h" });

            res.json({
                message: "login successfully",
                token: "Bearer " + token
            });
        } else {
            errors.password = " password incorrect";
            return res.status(400).json(errors);
        }
    },
    async getAllUsers(req, res) {
        const users = await AdminUser.find();
        if (users) {
            res.status(200).json({
                users
            });
        }
    }
};
