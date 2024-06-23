"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors = require('cors');
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const app = (0, express_1.default)();
/**
 * Configuramos los cors que sean para todo el mundo
 */
app.use(cors());
app.use(express_1.default.json());
//Routes
// autenticacion
app.use('/auth', authRoutes_1.default);
//user 
app.use('/users', userRoutes_1.default);
console.log('esto esta siendo ejecutadoo');
exports.default = app;
