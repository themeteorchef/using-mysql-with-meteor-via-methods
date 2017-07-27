import mysql from 'mysql';
import { Meteor } from 'meteor/meteor';

const connection = mysql.createConnection(Meteor.settings.private.mySQL);

export const query = (shape, sql, fields = {}) =>
new Promise((resolve, reject) => {
  connection.query(sql, fields, (error, results) => {
    if (error) reject(error);
    resolve({ array: results, object: results[0], _id: results.insertId, boolean: true }[shape]);
  });
});

export const find = async sql => query('array', sql);
export const findOne = async sql => query('object', sql);
export const insert = async (table, data) => query('_id', `INSERT INTO ${table} SET ?`, data);
export const update = async (table, _id, data) => query('boolean', `UPDATE ${table} SET ? WHERE _id = ?`, [data, _id]);
export const remove = async (table, _id) => query('boolean', `DELETE FROM ${table} WHERE _id = ${_id}`);
