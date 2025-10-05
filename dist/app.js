"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const task_routes_1 = __importDefault(require("./routes/task.routes"));
const protectet_route_1 = __importDefault(require("./routes/protectet.route"));
// import categoryRoutes from "./routes/category.route";
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
// Use User Routes
app.use("/api/users", user_routes_1.default);
app.use("/api/protected", protectet_route_1.default);
app.use("/api/task", task_routes_1.default);
// app.use("/api/category", categoryRoutes);
exports.default = app;
