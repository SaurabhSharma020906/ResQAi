const dns = require("dns");

console.log("Servers:", dns.getServers());

dns.resolveSrv(
  "_mongodb._tcp.resqai.h6lvhv2.mongodb.net",
  (err, records) => {
    console.log("SRV Error:", err);
    console.log("Records:", records);
  }
);