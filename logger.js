const fs = require("fs");
const { throws } = require("assert");

class Logger {
  constructor(name, path = "./log/") {
    this.filename = "LOG_" + name + ".txt";
    this.path = path;
  }

  createNewLog() {
    fs.writeFile(
      this.path + this.filename,
      this.getTimestamp() + "Logging started.\r\n",
      (e) => {
        if (e) throw e;
        console.log(`Log file ${this.filename} created successfully.\n`);
      }
    );
  }

  log(content) {
    fs.appendFile(
      this.path + this.filename,
      this.getTimestamp() + content + "\r\n",
      (e) => {
        if (e) throw e;
      }
    );
  }

  //Handle date

  getTimestamp() {
    let date = new Date();
    let result = `${date
      .getDate()
      .toString()
      .padStart(2, 0)}.${date
      .getMonth()
      .toString()
      .padStart(
        2,
        0
      )}.${date.getFullYear()} ${date
      .getHours()
      .toString()
      .padStart(2, 0)}:${date
      .getMinutes()
      .toString()
      .padStart(2, 0)}:${date.getSeconds().toString().padStart(2, 0)} # `;
    return result;
  }
}

module.exports = Logger;
