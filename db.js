/** Database setup for BizTime. */

const { Client } = require("pg");



// If we're running in test "mode", use our test db
// Make sure to create both databases!
// if (process.env.NODE_ENV === "test") {
//   DB_URI = "postgresql:///biztime_test";
// } else {
//   DB_URI = "postgresql:///biztime";
// }

let client = new Client({
  connectionString: "postgresql:///biztime"
});

db.connect();

module.exports = client;