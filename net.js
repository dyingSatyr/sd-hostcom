const Net = require("net");

//Include and init dotenv
require("dotenv").config();

// The port number and hostname of the server.
const facilityNo = process.env.FACILITY_NO;
const port = process.env.SERVER_PORT;
const host = process.env.SERVER_IP;
const ssl = process.env.SSL_ON;

// Start logger
const Logger = require("./logger");
let logger = new Logger(facilityNo);
logger.createNewLog();

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

let header2 = //example for manual open on 73
  headerLength +
  headerType +
  facilityNo +
  dateOfMessage +
  messageType +
  "00001" +
  "003" + //Message group
  "0000" + //Message version
  "08" +
  "00029" +
  reserved;

let header3 =
  headerLength +
  headerType +
  facilityNo +
  dateOfMessage +
  messageType +
  "00001" + //Consecutive number
  "016" + //Message group
  "0000" + //Message number
  "01" + //Message version
  "00005" + //Message length
  reserved;

// Create a new TCP client.
const client = new Net.Socket();

// Send a connection request to the server.
client.connect({ port, host }, () => {
  // If there is no error, the server has accepted the request and created a new socket dedicated to us.
  console.log(
    `TCP connection established with server @${client.remoteAddress}.`
  );
  logger.log(
    `TCP connection established with server @${client.remoteAddress}.`
  );
  // The client can now send data to the server by writing to its socket.

  // client.write(header + "00308");
  // client.write(header2 + "00731234567890123456789012345");

  //Send entries automatically
  sessionRequest(header, "016", "01");
  client.write(header3 + "10000");
});

let cN = 0;

// On data from server
client.on("data", (chunk) => {
  console.log(`${chunk.toString()}.`);
  logger.log(`${chunk.toString()}.`);
  //ACK
  ACK(getConsecutiveNumber(chunk.toString()));
  // Request an end to the connection after the data has been received.
  //client.end();
});

//Handle error event
client.on("error", (e) => {
  console.log(`Server error: ${e}`);
});

client.on("end", () => {
  console.log("Requested an end to the TCP connection");
});

//Session request
const sessionRequest = (header, msgGroup, msgGroupVersion) => {
  let data = header + msgGroup + msgGroupVersion;
  console.log(`Requesting session ${msgGroup}:${msgGroupVersion}`);
  logger.log(`Requesting session ${msgGroup}:${msgGroupVersion}`);
  client.write(data);
};

//Get Consecutive number from data
const getConsecutiveNumber = (str) => str.substring(28, 33);

const ACK = (cN) => {
  let headerLength = "00060"; // 5 digit 60
  let headerType = "0"; // 0 valid
  let dateOfMessage = "20191129093030"; //YYYYMMDDhhmmss
  let messageType = "1"; // 0 Req, 1 Res, 2 Control
  let consecutiveNo = cN; // 5 digit
  let messageGroup = "000"; //3 digit
  let messageNumber = "0004";
  let messageVersion = "01";
  let messageLength = "00000"; // 5 digit
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

  client.write(header);
  console.log(`ACK sent for message: ${consecutiveNo}`);
  logger.log(`ACK sent for message: ${consecutiveNo}`);
};
