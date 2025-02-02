const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = process.env;

module.exports = {
    register: async (req, res, next) => {
        try {
            let { name, email, password, password_confirmation } = req.body;
            if (password != password_confirmation) {
                return res.status(400).json({
                    status: false,
                    message: 'Bad Request',
                    err: 'please ensure that the password and password confirmation match!',
                    data: null
                });
            }

            let userExist = await prisma.user.findUnique({ where: { email } });
            if (userExist) {
                if (userExist.googleid) {
                    return res.status(400).json({
                        status: false,
                        message: 'Bad Request',
                        err: 'It appears that you registered using Google OAuth. Please use Google OAuth to log in.',
                        data: null
                    });
                }

                return res.status(400).json({
                    status: false,
                    message: 'Bad Request',
                    err: 'user has already been used!',
                    data: null
                });
            }

            let encryptedPassword = await bcrypt.hash(password, 10);
            let user = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: encryptedPassword
                }
            });

            return res.status(201).json({
                status: true,
                message: 'Created',
                err: null,
                data: { user }
            });
        } catch (err) {
            next(err);
        }
    },

    login: async (req, res, next) => {
        try {
            let { email, password } = req.body;

            let user = await prisma.user.findUnique({ where: { email } });
            if (!user) {
                return res.status(400).json({
                    status: false,
                    message: 'Bad Request',
                    err: 'invalid email or password!',
                    data: null
                });
            }

            if (!user.password && user.googleid) {
                return res.status(400).json({
                    status: false,
                    message: 'Bad Request',
                    err: 'It appears that you registered using Google. Please use Google to log in.',
                    data: null
                });
            } // check if user registered using google oauth

            let isPasswordCorrect = await bcrypt.compare(password, user.password);
            if (!isPasswordCorrect) {
                return res.status(400).json({
                    status: false,
                    message: 'Bad Request',
                    err: 'invalid email or password!',
                    data: null
                });
            }

            let token = jwt.sign({ id: user.id }, JWT_SECRET_KEY);

            res.cookie('token', token, { httpOnly: true }); // set token to cookies
            return res.redirect('http://localhost:5173/whoami'); // redirect to client
        } catch (err) {
            next(err);

        }
    },

    whoami: (req, res, next) => {
        return res.status(200).json({
            status: true,
            message: 'OK',
            err: null,
            data: { user: req.user }
        });
    },

    googleOauth2: (req, res) => {
        let token = jwt.sign({ id: req.user.id }, JWT_SECRET_KEY);

        res.cookie('token', token, { httpOnly: true }); // set token to cookies
        return res.redirect('http://localhost:5173/whoami'); // redirect to client
    }
};