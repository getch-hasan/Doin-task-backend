"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller"); // <-- Fixed Import
const multer_1 = __importDefault(require("multer"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const upload = (0, multer_1.default)();
const router = express_1.default.Router();
router.get("/", user_controller_1.getUsers);
router.post("/register", upload.none(), user_controller_1.register);
router.post("/login", upload.none(), user_controller_1.logIn);
router.post("/forgot-password", upload.none(), user_controller_1.forgotPassword);
router.post("/reset-password", upload.none(), user_controller_1.resetPassword);
router.get("/me", auth_middleware_1.authenticationToken, user_controller_1.getProfile);
exports.default = router;
