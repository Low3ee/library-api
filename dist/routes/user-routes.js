"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_js_1 = __importDefault(require("../lib/db.js"));
const user_validation_js_1 = require("../middleware/user-validation.js");
const userRouter = express_1.default.Router();
userRouter.post("/signup", user_validation_js_1.validateRegistration, (req, res, next) => {
    console.log(`body: ${JSON.stringify(req.body)}`);
    db_js_1.default.query("SELECT id FROM users WHERE LOWER(username) = LOWER(?)", [req.body.username], (err, result) => {
        if (result && result.length) {
            return res.status(409).send({
                message: "This username is already taken.",
            });
        }
        else {
            bcrypt_1.default.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    res.status(500).send({
                        message: err,
                    });
                }
                else {
                    db_js_1.default.query("INSERT INTO users(email, name, username, password, course,year_level, contact_no) VALUES (?, ?, ?, ?, ?, ?, ?)", [
                        req.body.email,
                        req.body.name,
                        req.body.username,
                        hash,
                        req.body.course,
                        req.body.year_level,
                        req.body.contact_no,
                    ], (err, result) => {
                        if (err) {
                            console.log(err);
                            return res.status(500).send({
                                message: err,
                            });
                        }
                        else {
                            return res.status(201).send({
                                message: `Registered successfully.`,
                            });
                        }
                    });
                }
            });
        }
    });
});
userRouter.post("/login", (req, res, next) => {
    const { creds, password } = req.body;
    const input = creds.includes("@") ? "email" : "username";
    console.log(`logging in using ${input}`);
    db_js_1.default.query(`SELECT * FROM users WHERE ${input} = ?`, [creds], (err, result) => {
        if (err) {
            return res.status(500).send({
                message: "Database error",
                error: err,
            });
        }
        if (!result.length) {
            console.log("incorrect creds fail");
            return res.status(400).send({
                message: `There is no account with that ${input}`,
            });
        }
        const user = result[0];
        if (!user.password) {
            console.log("incorrect pass fail");
            return res.status(400).send({
                message: "Incorrect Password",
            });
        }
        bcrypt_1.default.compare(password, user.password, (bErr, bResult) => {
            if (bErr) {
                return res.status(500).send({
                    message: "Bcrypt error",
                    error: bErr,
                });
            }
            if (bResult) {
                const tokenKey = process.env.TOKEN_KEY || "secret_token";
                db_js_1.default.query(`UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ${user.id}`);
                const token = jsonwebtoken_1.default.sign({
                    username: user.username,
                    name: user.name,
                    userId: user.id,
                    email: user.email,
                    course: user.course,
                    year_level: user.year_level,
                    contact_no: user.contact_no,
                    balance: user.balance,
                    role: user.role,
                    date_enrolled: user.date_created,
                }, tokenKey, { expiresIn: "7d" });
                console.log("success");
                return res.status(200).send({
                    message: "Login successful",
                    token,
                });
            }
            console.log("pass fail");
            return res.status(400).send({
                message: "Password is incorrect.",
            });
        });
    });
});
userRouter.get("/secret", user_validation_js_1.validateAdminSession, (req, res, next) => {
    res.send("Welcome to the secret route =>");
});
userRouter.patch("/edit/:userId", user_validation_js_1.validateSession, (req, res, next) => {
    const userId = req.params.userId;
    db_js_1.default.query(`UPDATE users SET email = ?, username = ?, fname = ?, lname = ?, modified_at = CURRENT_TIMESTAMP WHERE id = ${userId}`, [req.body.email, req.body.username, req.body.fname, req.body.lname], (err, result) => {
        if (err) {
            return res.status(500).send({
                message: "Database Error",
                error: err,
            });
        }
        return res.status(200).send({
            message: "User modified successfully!",
        });
    });
});
userRouter.get("/getBalance/:userId", (req, res, next) => {
    const userId = req.params.userId;
    db_js_1.default.query("SELECT balance FROM users WHERE id = ?", [userId], (err, result) => {
        if (err) {
            res.status(500).send({
                message: err,
            });
        }
        res.status(200).send({
            balance: result[0].balance,
        });
    });
});
userRouter.delete("/delete/:userId", user_validation_js_1.validateSession, (req, res, next) => {
    const userId = req.params.userId;
    db_js_1.default.query(`DELETE FROM users WHERE id = ${userId}`, (err, result) => {
        if (err) {
            res.status(500).send({
                message: `Database Error ${err}`,
                err: err,
            });
        }
        else {
            res.status(200).send({
                message: "User Deleted successfully.",
            });
        }
    });
});
userRouter.get("/all", (req, res, next) => {
    db_js_1.default.query("SELECT * FROM users", (err, result) => {
        if (err) {
            return res.status(500).send({
                message: "Database Error",
                error: err,
            });
        }
        return res.status(200).send(result);
    });
});
userRouter.get("/getUsersByIds", (req, res, next) => {
    const userIdsParam = req.query.userIds;
    if (!userIdsParam) {
        return res.status(400).send({
            message: "No User IDs to search.",
        });
    }
    const userIds = userIdsParam.split(",");
    db_js_1.default.query("SELECT * FROM users WHERE id IN (?)", [userIds], (err, result) => {
        if (err) {
            return res.status(500).send({
                message: "Database Error",
                error: err,
            });
        }
        return res.status(200).send(result);
    });
});
exports.default = userRouter;
