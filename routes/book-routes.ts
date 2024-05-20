import express, { Request, Response, NextFunction } from "express";
import db from "../lib/db.js";
import { v4 } from "uuid";
// import {
//   validateAdminSession,
//   validateRegistration,
//   validateSession,
// } from "../middleware/user-validation.js";

const bookRoutes = express.Router();

bookRoutes.post("/add", (req: Request, res: Response, next: NextFunction) => {
  db.query(
    "SELECT id FROM books WHERE LOWER(name) = LOWER(?) AND  LOWER(author) = LOWER(?)",
    [req.body.name, req.body.author],
    (err: any, result: string | any[]) => {
      if (result?.length) {
        return res.status(409).send({
          message: "This book is already registered.",
        });
      } else {
        db.query(
          "INSERT INTO books(name, author, category, added_by) VALUES (?, ?, ?, ?)",
          [
            req.body.name,
            req.body.author,
            req.body.category,
            req.body.added_by,
          ],
          (err: any, result: any) => {
            if (err) {
              console.log(err);
              return res.status(500).send({
                message: err,
              });
            } else {
              return res.status(201).send({
                message: `Book Registered successfully.`,
              });
            }
          }
        );
      }
    }
  );
});
bookRoutes.get(
  "/getBooks",
  (req: Request, res: Response, next: NextFunction) => {
    db.query("SELECT * FROM books", (err: any, result: any) => {
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
  }
);

// Edit book route
bookRoutes.patch(
  "/edit/:id",
  (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { name, author, category, modified_by } = req.body;
    db.query(
      "UPDATE books SET name = ?, author = ?, category = ?, modified_by = ?, modified_at = CURRENT_TIMESTAMP WHERE id = ?",
      [name, author, category, modified_by, id],
      (err: any, result: any) => {
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
      }
    );
  }
);

// Delete book route
bookRoutes.delete(
  "/delete/:id",
  (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    db.query(
      "DELETE FROM books WHERE id = ?",
      [id],
      (err: any, result: any) => {
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
      }
    );
  }
);

export default bookRoutes;
