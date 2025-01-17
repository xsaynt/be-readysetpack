"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkExist = void 0;
const pg_format_1 = __importDefault(require("pg-format"));
const connection_1 = __importDefault(require("../db/connection"));
const checkExist = async (table, column, value) => {
    const queryStr = (0, pg_format_1.default)("SELECT * FROM %I WHERE %I = $1", table, column);
    const dbOutput = await connection_1.default.query(queryStr, [value]);
    if (dbOutput.rows.length === 0) {
        return Promise.reject({ statusCode: 404, message: "Does Not Found" });
    }
};
exports.checkExist = checkExist;
