const mysql = require("mysql");

class DatabaseSingleton {
  constructor() {
    this.connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "photodb",
    });
  }

  query(sql, values, callback) {
    return this.connection.query(sql, values, callback);
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DatabaseSingleton();
    }
    return this.instance;
  }
}

module.exports = DatabaseSingleton.getInstance();
