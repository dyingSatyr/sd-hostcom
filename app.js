const tls = require("tls");
const fs = require("fs");

const options = {
  // pfx: [fs.readFileSync("./certificates/OSCI-SelfSigned.pfx")],
  // enableTace: true,
  // passphrase: "password",
  // key: fs.readFileSync("./certificates/key.pem", "utf8"),
  // cert: fs.readFileSync("./certificates/cert.pem", "utf8"),
  // ca: [fs.readFileSync("./certificates/cert.pem", "utf8")]
};

//Include and init dotenv
require("dotenv").config();

// The port number and hostname of the server.
const facilityNo = process.env.FACILITY_NO;
const port = process.env.SERVER_PORT;
const host = process.env.SERVER_IP;
const ssl = process.env.SSL_ON;

let headerLength = "00060"; // 5 digit 60
let headerType = "0"; // 0 valid
let dateOfMessage = "20191129093030"; //YYYYMMDDhhmmss
let messageType = "0"; // 0 Req, 1 Res, 2 Control
let consecutiveNo = "00000"; // 5 digit
let messageGroup = "000"; //3 digit
let messageNumber = "0000";
let messageVersion = "01";
let messageLength = "00005"; // 5 digit
let reserved = "0000000000000"; // 13 0's

let header =
  headerLength +
  headerType +
  facilityNo +
  dateOfMessage +
  messageType +
  consecutiveNo +
  messageGroup +
  messageNumber +
  messageVersion +
  messageLength +
  reserved;

let header2 =
  headerLength +
  headerType +
  facilityNo +
  dateOfMessage +
  messageType +
  "00001" +
  "003" +
  "0000" +
  "08" +
  "00029" +
  reserved;

let socket = tls.connect(port, host, options, () => {
  console.log("Connection established.");
  // console.log(
  //   `Client connection established. \nConnection authorization: ${
  //     socket.authorized ? "Authorized" : "Unauthorized"
  //   }.`
  // );
  //console.log(socket);
  // socket.write(header + "00001");
  // socket.write(header2 + "00731234567890123456789012345");
});

socket.on("data", (data) => {
  console.log(data.toString());
});

socket.on("error", (e) => {
  console.log(`Server error: ${e}`);
});

socket.on("end", () => {
  console.log("server ends connection");
});
