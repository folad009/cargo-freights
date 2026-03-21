
const express = require('express');
const mysql = require('mysql2');


// database connection and query promisify
var conn = mysql.createPool({
    host     : 'caboose.proxy.rlwy.net',
    user     : 'root',
    password : 'NrmHTVRbssQYkFRmkDWPEdNFUoauERZL',
    database : 'railway',
    connectionLimit : 100,
    port: '51199'
  });


const mySqlQury =(qry)=>{
    return new Promise((resolve, reject)=>{
        conn.query(qry, (err, row)=>{
            if (err) return reject(err);
            resolve(row)
        })
    }) 
}

  
module.exports = {conn, mySqlQury}