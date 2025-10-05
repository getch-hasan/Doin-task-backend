"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const express_1 = __importDefault(require("express"));
const task_controller_1 = require("../controllers/task.controller");
const upload_1 = require("../middlewares/upload");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
const upload = (0, multer_1.default)();
router.post("/", upload_1.uploadTaskImage, task_controller_1.createTask);
router.get("/", auth_middleware_1.authenticationToken, task_controller_1.getTasks);
router.delete("/:id", task_controller_1.deleteTask);
router.put("/:id", upload.none(), task_controller_1.updateTask);
router.get("/:id", task_controller_1.getTaskById);
router.post("/search", upload.none(), task_controller_1.searchTask);
exports.default = router;
