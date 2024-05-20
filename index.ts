import express from "express";
import cors from "cors";
import { config } from "dotenv";
import userRouter from "./routes/user-routes";
import bookRoutes from "./routes/book-routes";
import bookRentRoutes from "./routes/rentedBooks-routes";

config();

const app = express();
const PORT = process.env.PORT ?? 4201;

app.use(express.json());
app.use(cors());

app.use("/api/user", userRouter);
app.use("/api/books", bookRoutes);
app.use("/api/rents", bookRentRoutes);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

export default app;
