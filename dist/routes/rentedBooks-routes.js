"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_js_1 = __importDefault(require("../lib/db.js"));
// import {
//   validateAdminSession,
//   validateRegistration,
//   validateSession,
// } from "../middleware/user-validation.js";
const bookRentRoutes = express_1.default.Router();
// Route to add a borrowed book entry
bookRentRoutes.post("/rent", (req, res, next) => {
    console.log(req.body);
    let sql = "INSERT INTO borrowedBook(user_id, bookId, date_borrowed, issued_by, date_due) VALUES (?, ?, CURRENT_TIMESTAMP, ?, ?)";
    db_js_1.default.query(sql, [req.body.user_id, req.body.bookId, req.body.issuer, req.body.date_due], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send({
                message: err,
            });
        }
        return res.status(201).send({
            message: `Checkout successful, ID: ${result.id}`,
        });
    });
});
// Route to update a borrowed book entry
bookRentRoutes.patch("/return", (req, res, next) => {
    console.log(`nakasud man with body: ${req.body.fine}`);
    const { penalty, remarks, checkoutId, studentId } = req.body;
    db_js_1.default.query("UPDATE borrowedBook SET returned = 1, fine = ?, remarks = ? WHERE id = ? AND user_id = ?", [penalty, remarks, checkoutId, studentId], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send({
                message: err,
            });
        }
        if (result.affectedRows === 0) {
            return res.status(404).send({
                message: "Borrowed book entry not found.",
            });
        }
        db_js_1.default.query(`UPDATE users SET balance = (balance + ${penalty}) WHERE id = ${studentId}`);
        return res.status(200).send({
            message: "Borrowed book entry updated successfully.",
        });
    });
});
// Route to fetch all borrowed books
bookRentRoutes.get("/rented", (req, res, next) => {
    db_js_1.default.query("SELECT * FROM borrowedBook", (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send({
                message: err,
            });
        }
        return res.status(200).send({
            message: "Borrowed books fetched successfully.",
            borrowedBooks: result,
        });
    });
});
bookRentRoutes.get("/rented/:userId", (req, res, next) => {
    const { userId } = req.params;
    db_js_1.default.query("SELECT borrowedBook.*, DATE(borrowedBook.date_due) as date_due, DATE(date_borrowed) as date_borrowed ,books.name, books.category, books.condition FROM borrowedBook LEFT JOIN books ON borrowedBook.bookId = books.id WHERE user_id = ?", [userId], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send({
                message: err,
            });
        }
        console.log(result);
        return res.status(200).send({
            message: "Rented books fetched successfully.",
            data: result,
        });
    });
});
// Route to get all returned books of a user
bookRentRoutes.get("/returned/:userId", (req, res, next) => {
    const { userId } = req.params;
    db_js_1.default.query("SELECT * FROM borrowedBook WHERE user_id = ? AND returned = 1", [userId], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send({
                message: err,
            });
        }
        return res.status(200).send({
            message: "Rented books fetched successfully.",
            data: result[0],
        });
    });
});
// Route to get all not returned books of a user
bookRentRoutes.get("/not-returned/:userId", (req, res, next) => {
    const { userId } = req.params;
    db_js_1.default.query("SELECT COUNT(*) as count FROM borrowedBook WHERE user_id = ? AND returned = 0", [userId], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send({
                message: err,
            });
        }
        return res.status(200).send({
            message: "Rented books fetched successfully.",
            data: result[0],
        });
    });
});
exports.default = bookRentRoutes;
