"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = require("dotenv");
const user_routes_1 = __importDefault(require("./routes/user-routes"));
const book_routes_1 = __importDefault(require("./routes/book-routes"));
const rentedBooks_routes_1 = __importDefault(require("./routes/rentedBooks-routes"));
(0, dotenv_1.config)();
const app = (0, express_1.default)();
const PORT = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 4201;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/api/user", user_routes_1.default);
app.use("/api/books", book_routes_1.default);
app.use("/api/rents", rentedBooks_routes_1.default);
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
exports.default = app;
