import express, { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import db from "../lib/db.js";
import {
  validateAdminSession,
  validateRegistration,
  validateSession,
} from "../middleware/user-validation.js";

const userRouter = express.Router();

userRouter.post(
  "/signup",
  validateRegistration,
  (req: Request, res: Response, next: NextFunction) => {
    console.log(`body: ${JSON.stringify(req.body)}`);
    db.query(
      "SELECT id FROM users WHERE LOWER(username) = LOWER(?)",
      [req.body.username],
      (err: any, result: any[]) => {
        if (err) {
          return res.status(500).send({
            message: "Database error",
            error: err,
          });
        }

        if (result && result.length) {
          return res.status(409).send({
            message: "This username is already taken.",
          });
        }

        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).send({
              message: err,
            });
          }

          db.query(
            "INSERT INTO users(email, name, username, password, course, year_level, contact) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [
              req.body.email,
              req.body.name,
              req.body.username,
              hash,
              req.body.course,
              req.body.year_level,
              req.body.contact_no,
            ],
            (err: any, result: any) => {
              if (err) {
                console.log(err);
                return res.status(500).send({
                  message: err,
                });
              }

              return res.status(201).send({
                message: "Registered successfully.",
              });
            }
          );
        });
      }
    );
  }
);

userRouter.post("/login", (req: Request, res: Response, next: NextFunction) => {
  const { creds, password } = req.body;
  const input = creds.includes("@") ? "email" : "username";

  console.log(`logging in using ${input}`);

  db.query(
    `SELECT * FROM users WHERE ${input} = ?`,
    [creds],
    (err: any, result: any[]) => {
      if (err) {
        return res.status(500).send({
          message: "Database error",
          error: err,
        });
      }

      if (!result || result.length === 0) {
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

      bcrypt.compare(password, user.password, (bErr, bResult) => {
        if (bErr) {
          return res.status(500).send({
            message: "Bcrypt error",
            error: bErr,
          });
        }

        if (bResult) {
          const tokenKey = process.env.TOKEN_KEY || "secret_token";
          db.query(
            `UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?`,
            [user.id]
          );

          const token = jwt.sign(
            {
              username: user.username,
              name: user.name,
              userId: user.id,
              email: user.email,
              course: user.course,
              year_level: user.year_level,
              contact: user.contact,
              balance: user.balance,
              role: user.role,
              date_enrolled: user.date_created,
            },
            tokenKey,
            { expiresIn: "7d" }
          );

          console.log(user);
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
    }
  );
});

userRouter.get(
  "/secret",
  validateSession,
  (req: Request, res: Response, next: NextFunction) => {
    res.send("Welcome to the secret route =>");
  }
);

userRouter.patch(
  "/edit/:userId",
  validateSession,
  (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;
    db.query(
      `UPDATE users SET email = ?, username = ?, name = ?, balance = ?, contact = ?, course = ?, year_level = ?, modified_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [
        req.body.email,
        req.body.username,
        req.body.name,
        req.body.balance,
        req.body.contact,
        req.body.course,
        req.body.year_level,
        userId,
      ],
      (err: any, result: any) => {
        if (err) {
          console.log(err);
          return res.status(500).send({
            message: `Database Error: ${err}`,
            error: err,
          });
        }

        return res.status(200).send({
          message: "User modified successfully!",
        });
      }
    );
  }
);

userRouter.get(
  "/getBalance/:userId",
  (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;
    db.query(
      "SELECT balance FROM users WHERE id = ?",
      [userId],
      (err: any, result: any) => {
        if (err) {
          return res.status(500).send({
            message: "Database error",
            error: err,
          });
        }

        if (!result || result.length === 0) {
          return res.status(404).send({
            message: "User not found",
          });
        }

        return res.status(200).send({
          balance: result[0].balance,
        });
      }
    );
  }
);

userRouter.delete(
  "/delete/:userId",
  validateAdminSession,
  (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;
    db.query(
      `DELETE FROM users WHERE id = ?`,
      [userId],
      (err: any, result: any) => {
        if (err) {
          return res.status(500).send({
            message: `Database Error ${err}`,
            error: err,
          });
        }

        return res.status(200).send({
          message: "User deleted successfully.",
        });
      }
    );
  }
);

userRouter.get("/all", (req: Request, res: Response, next: NextFunction) => {
  db.query("SELECT * FROM users", (err: any, result: any) => {
    if (err) {
      return res.status(500).send({
        message: "Database Error",
        error: err,
      });
    }

    console.log(result);
    return res.status(200).send(result);
  });
});

userRouter.get(
  "/getUsersByIds",
  (req: Request, res: Response, next: NextFunction) => {
    const userIdsParam = req.query.userIds;
    if (!userIdsParam) {
      return res.status(400).send({
        message: "No User IDs to search.",
      });
    }

    const userIds = (userIdsParam as string).split(",");
    db.query(
      "SELECT * FROM users WHERE id IN (?)",
      [userIds],
      (err: any, result: any[]) => {
        if (err) {
          return res.status(500).send({
            message: "Database Error",
            error: err,
          });
        }

        return res.status(200).send(result);
      }
    );
  }
);

export default userRouter;
