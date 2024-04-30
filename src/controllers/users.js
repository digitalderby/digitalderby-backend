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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUserById = exports.getAllUsers = void 0;
var errorHandler_js_1 = require("../errorHandler.js");
var User_js_1 = require("../models/User.js");
function getAllUsers(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var usernames, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, User_js_1.default.find({}, "username").lean()];
                case 1:
                    usernames = _a.sent();
                    res.status(200).json(usernames.map(function (u) { return u.username; }));
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    (0, errorHandler_js_1.sendJSONError)(res, 500, "Internal error retrieving users: ".concat(error_1));
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.getAllUsers = getAllUsers;
function getUserById(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var user, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, User_js_1.default.findOne({ username: req.params.uname }, "-passwordHash")];
                case 1:
                    user = _a.sent();
                    if (!user) {
                        return [2 /*return*/, (0, errorHandler_js_1.sendJSONError)(res, 404, "User ".concat(req.params.uname, " not found"))];
                    }
                    res.status(200).json(user);
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    (0, errorHandler_js_1.sendJSONError)(res, 500, "Internal error retrieving user: ".concat(error_2));
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.getUserById = getUserById;
// EVERYTHING ABOVE THIS LINE IS THE SAME AS BEFORE
// Function to create a new user
function createUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var userData, newUser, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    userData = req.body;
                    newUser = new User_js_1.default(userData);
                    // Save the user to the database
                    return [4 /*yield*/, newUser.save()];
                case 1:
                    // Save the user to the database
                    _a.sent();
                    // Return the newly created user in the response
                    res.status(201).json(newUser);
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _a.sent();
                    // Handle errors
                    (0, errorHandler_js_1.sendJSONError)(res, 500, "Internal error creating user: ".concat(error_3));
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.createUser = createUser;
// Function to update a user by ID
function updateUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var userIdToUpdate, updatedUserData, updatedUser, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    userIdToUpdate = req.params.userId;
                    updatedUserData = req.body;
                    return [4 /*yield*/, User_js_1.default.findByIdAndUpdate(userIdToUpdate, updatedUserData, { new: true })];
                case 1:
                    updatedUser = _a.sent();
                    // If user does not exist, return 404 Not Found
                    if (!updatedUser) {
                        return [2 /*return*/, (0, errorHandler_js_1.sendJSONError)(res, 404, "User ".concat(userIdToUpdate, " not found"))];
                    }
                    // Return the updated user in the response
                    res.status(200).json(updatedUser);
                    return [3 /*break*/, 3];
                case 2:
                    error_4 = _a.sent();
                    // Handle errors
                    (0, errorHandler_js_1.sendJSONError)(res, 500, "Internal error updating user: ".concat(error_4));
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.updateUser = updateUser;
// TODO: Check for security vulnerabilities in this function
// Function to delete a user by ID
function deleteUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var userIdToDelete, user, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    userIdToDelete = req.params.userId;
                    return [4 /*yield*/, User_js_1.default.findById(userIdToDelete)];
                case 1:
                    user = _a.sent();
                    // If user does not exist, return 404 Not Found
                    if (!user) {
                        return [2 /*return*/, (0, errorHandler_js_1.sendJSONError)(res, 404, "User ".concat(userIdToDelete, " not found"))];
                    }
                    // Delete the user
                    return [4 /*yield*/, User_js_1.default.deleteOne({ _id: userIdToDelete })];
                case 2:
                    // Delete the user
                    _a.sent();
                    // Return success message
                    res.status(200).json({
                        message: "User ".concat(userIdToDelete, " has been deleted successfully"),
                    });
                    return [3 /*break*/, 4];
                case 3:
                    error_5 = _a.sent();
                    // Handle errors
                    (0, errorHandler_js_1.sendJSONError)(res, 500, "Internal error deleting user: ".concat(error_5));
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.deleteUser = deleteUser;
