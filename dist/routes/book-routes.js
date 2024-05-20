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
const bookRoutes = express_1.default.Router();
bookRoutes.post("/add", (req, res, next) => {
    db_js_1.default.query("SELECT id FROM books WHERE LOWER(name) = LOWER(?) AND  LOWER(author) = LOWER(?)", [req.body.name, req.body.author], (err, result) => {
        if (result === null || result === void 0 ? void 0 : result.length) {
            return res.status(409).send({
                message: "This book is already registered.",
            });
        }
        else {
            db_js_1.default.query("INSERT INTO books(name, author, category, added_by) VALUES (?, ?, ?, ?)", [
                req.body.name,
                req.body.author,
                req.body.category,
                req.body.added_by,
            ], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send({
                        message: err,
                    });
                }
                else {
                    return res.status(201).send({
                        message: `Book Registered successfully.`,
                    });
                }
            });
        }
    });
});
bookRoutes.get("/getBooks", (req, res, next) => {
    db_js_1.default.query("SELECT * FROM books", (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send({
                message: err,
            });
        }
        return res.status(200).send({
            message: "Books Fetched Successfully.",
            books: result,
        });
    });
});
// Edit book route
bookRoutes.patch("/edit/:id", (req, res, next) => {
    const { id } = req.params;
    const { name, author, category, modified_by } = req.body;
    db_js_1.default.query("UPDATE books SET name = ?, author = ?, category = ?, modified_by = ?, modified_at = CURRENT_TIMESTAMP WHERE id = ?", [name, author, category, modified_by, id], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send({
                message: err,
            });
        }
        if (result.affectedRows === 0) {
            return res.status(404).send({
                message: "Book not found.",
            });
        }
        return res.status(200).send({
            message: "Book updated successfully.",
        });
    });
});
// Delete book route
bookRoutes.delete("/delete/:id", (req, res, next) => {
    const { id } = req.params;
    db_js_1.default.query("DELETE FROM books WHERE id = ?", [id], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send({
                message: err,
            });
        }
        if (result.affectedRows === 0) {
            return res.status(404).send({
                message: "Book not found.",
            });
        }
        return res.status(200).send({
            message: "Book deleted successfully.",
        });
    });
});
exports.default = bookRoutes;
