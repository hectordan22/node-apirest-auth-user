"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUserById = exports.getAllUsers = exports.createUser = void 0;
const password_service_1 = require("../services/password.service");
const user_1 = __importDefault(require("../models/user"));
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { email, password, name } = req.body;
        if (!email) {
            res.status(400).json({ error: true, message: "El email es obligatorio" });
            return;
        }
        if (!password) {
            res.status(400).json({ error: true, message: "El email ingresado ya existe" });
            return;
        }
        const hashedPassword = yield (0, password_service_1.hashPassword)(password);
        const body = {
            email,
            password: hashedPassword,
            nombre: name || 'user'
        };
        // registro el user en la BD
        const user = yield user_1.default.create({
            data: body
        });
        res.status(201).json({ error: false, user });
    }
    catch (error) {
        // en caso de Postgresql detecte que se intenta registrar un email duplicado
        if ((error === null || error === void 0 ? void 0 : error.code) === 'P2002' && ((_b = (_a = error === null || error === void 0 ? void 0 : error.meta) === null || _a === void 0 ? void 0 : _a.target) === null || _b === void 0 ? void 0 : _b.includes('email'))) {
            res.status(400).json({ error: true, message: "El email ingresado ya existe" });
        }
        else {
            res.status(500).json({ error: true, message: 'Hubo un error pruebe mas tarde' });
        }
    }
});
exports.createUser = createUser;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_1.default.findMany();
        res.status(200).json({ error: false, users });
    }
    catch (error) {
        res.status(500).json({ error: true, message: 'Hubo un error pruebe mas tarde' });
    }
});
exports.getAllUsers = getAllUsers;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = parseInt(req.params.id);
    try {
        const user = yield user_1.default.findUnique({
            where: {
                id: userId
            }
        });
        if (!user) {
            res.status(404).json({ error: true, message: 'el usuario no fue encontrado' });
            return;
        }
        res.status(200).json({ error: false, user });
    }
    catch (error) {
        res.status(500).json({ error: true, message: 'Hubo un error pruebe mas tarde' });
    }
});
exports.getUserById = getUserById;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    const userId = parseInt(req.params.id);
    const { password, email, name } = req.body;
    try {
        let dataToUpdate = Object.assign({}, req.body);
        if (password) {
            const hashedPassword = yield (0, password_service_1.hashPassword)(password);
            dataToUpdate.password = hashedPassword;
        }
        if (email) {
            dataToUpdate.email = email;
        }
        dataToUpdate.name = name || 'user';
        // actualizo en la base de datos
        const user = yield user_1.default.update({
            where: {
                id: userId
            },
            data: dataToUpdate
        });
        res.status(200).json({ error: false, user });
    }
    catch (error) {
        if ((error === null || error === void 0 ? void 0 : error.code) === 'P2002' && ((_d = (_c = error === null || error === void 0 ? void 0 : error.meta) === null || _c === void 0 ? void 0 : _c.target) === null || _d === void 0 ? void 0 : _d.includes('email'))) {
            res.status(400).json({ error: true, message: "El email ingresado ya existe" });
        }
        else if ((error === null || error === void 0 ? void 0 : error.code) === 'P2025') {
            res.status(404).json({ error: true, message: 'Usuario no encontrado' });
        }
        else {
            res.status(500).json({ error: true, message: 'Hubo un error pruebe mas tarde' });
        }
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = parseInt(req.params.id);
    try {
        yield user_1.default.delete({
            where: {
                id: userId
            }
        });
        res.status(200).json({
            error: false,
            message: `El usuario ${userId} ha sido eliminado`
        }).end();
    }
    catch (error) {
        if ((error === null || error === void 0 ? void 0 : error.code) === 'P2025') {
            res.status(404).json({ error: true, message: 'Usuario no encontrado' });
        }
        else {
            res.status(500).json({ error: true, message: 'Hubo un error pruebe mas tarde' });
        }
    }
});
exports.deleteUser = deleteUser;
