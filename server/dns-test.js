const dns = require("dns");

dns.lookup("google.com", (err, address, family) => {
  console.log("lookup:");
  console.log(err);
  console.log(address);
  console.log(family);
});

dns.resolve4("google.com", (err, addresses) => {
  console.log("resolve4:");
  console.log(err);
  console.log(addresses);
});