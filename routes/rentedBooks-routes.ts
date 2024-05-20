import express, { Request, Response, NextFunction } from "express";
import db from "../lib/db.js";
import { v4 } from "uuid";
// import {
//   validateAdminSession,
//   validateRegistration,
//   validateSession,
// } from "../middleware/user-validation.js";

const bookRentRoutes = express.Router();

// Route to add a borrowed book entry
bookRentRoutes.post(
  "/rent",
  (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    let sql =
      "INSERT INTO borrowedBook(user_id, bookId, date_borrowed, issued_by, date_due) VALUES (?, ?, CURRENT_TIMESTAMP, ?, ?)";
    db.query(
      sql,
      [req.body.user_id, req.body.bookId, req.body.issuer, req.body.date_due],
      (err: any, result: any) => {
        if (err) {
          console.log(err);
          return res.status(500).send({
            message: err,
          });
        }
        return res.status(201).send({
          message: `Checkout successful, ID: ${result.id}`,
        });
      }
    );
  }
);

// Route to update a borrowed book entry
bookRentRoutes.patch(
  "/return",
  (req: Request, res: Response, next: NextFunction) => {
    console.log(`nakasud man with body: ${req.body.fine}`);
    const { penalty, remarks, checkoutId, studentId } = req.body;
    db.query(
      "UPDATE borrowedBook SET returned = 1, fine = ?, remarks = ? WHERE id = ? AND user_id = ?",
      [penalty, remarks, checkoutId, studentId],
      (err: any, result: any) => {
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
        db.query(
          `UPDATE users SET balance = (balance + ${penalty}) WHERE id = ${studentId}`
        );
        return res.status(200).send({
          message: "Borrowed book entry updated successfully.",
        });
      }
    );
  }
);

// Route to fetch all borrowed books
bookRentRoutes.get(
  "/rented",
  (req: Request, res: Response, next: NextFunction) => {
    db.query("SELECT * FROM borrowedBook", (err: any, result: any) => {
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
  }
);

bookRentRoutes.get(
  "/rented/:userId",
  (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    db.query(
      "SELECT borrowedBook.*, DATE(borrowedBook.date_due) as date_due, DATE(date_borrowed) as date_borrowed ,books.name, books.category, books.condition FROM borrowedBook LEFT JOIN books ON borrowedBook.bookId = books.id WHERE user_id = ?",
      [userId],
      (err: any, result: any) => {
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
      }
    );
  }
);

// Route to get all returned books of a user
bookRentRoutes.get(
  "/returned/:userId",
  (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    db.query(
      "SELECT * FROM borrowedBook WHERE user_id = ? AND returned = 1",
      [userId],
      (err: any, result: any) => {
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
      }
    );
  }
);

// Route to get all not returned books of a user
bookRentRoutes.get(
  "/not-returned/:userId",
  (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    db.query(
      "SELECT COUNT(*) as count FROM borrowedBook WHERE user_id = ? AND returned = 0",
      [userId],
      (err: any, result: any) => {
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
      }
    );
  }
);

export default bookRentRoutes;
