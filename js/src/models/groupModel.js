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
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = require("../db/mysql");
const groupModel = {};
groupModel.create = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { group_name, group_status, director_id } = data;
        const connection = yield mysql_1.mysqlDB.getConnection();
        const query = `INSERT INTO GroupTable (group_name, group_status,director_id) VALUES (?, ?, ?)`;
        const groupData = [group_name, group_status, director_id];
        const [result] = yield connection.query(query, groupData);
        if (!result) {
            connection.release();
            return null;
        }
        connection.release();
        return result;
    }
    catch (err) {
        throw err;
    }
});
groupModel.update = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { group_id, group_name, group_status, director_id } = data;
        const connection = yield mysql_1.mysqlDB.getConnection();
        const query = `UPDATE GroupTable SET group_name = ?, director_id = ? , group_status = ? WHERE group_id = ?`;
        const groupData = [group_name, director_id, group_status, group_id];
        const [result] = yield connection.query(query, groupData);
        if (!result) {
            connection.release();
            return null;
        }
        connection.release();
        return result;
    }
    catch (err) {
        throw err;
    }
});
groupModel.getAll = () => __awaiter(void 0, void 0, void 0, function* () {
    const query = ` 
    SELECT
        g.group_id, g.group_name, g.group_status,
        d.director_rank, d.director_fname, d.director_lname
    FROM
        GroupTable g
    LEFT JOIN
        Director d ON g.director_id = d.director_id;   
      `;
    const [rows] = yield mysql_1.mysqlDB.query(query);
    if (!rows)
        return null;
    return rows;
});
groupModel.getById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const query = ` 
  SELECT
    g.group_name, g.director_id,  g.group_status,
    d.director_rank, d.director_fname, d.director_lname
  FROM
    GroupTable g
  LEFT JOIN
    Director d ON g.director_id = d.director_id   
  WHERE g.group_id = ?;
      `;
    const [rows] = yield mysql_1.mysqlDB.query(query, [id]);
    if (!rows)
        return null;
    return rows;
});
groupModel.deleteGroupById = (groupId) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `DELETE FROM GroupTable WHERE group_id=${groupId}`;
    const [rows] = yield mysql_1.mysqlDB.query(query);
    return rows ? true : false;
});
exports.default = groupModel;
