const fs = require("fs");
const selfsigned = require("selfsigned");

// SSL attributes
const attrs = [{ name: "commonName", value: "localhost" }];

// Generate self-signed certificate
const pems = selfsigned.generate(attrs, { days: 365 });

// ssl create if not exists
if (!fs.existsSync("ssl")) fs.mkdirSync("ssl");

// Files save
fs.writeFileSync("ssl/private-key.pem", pems.private);
fs.writeFileSync("ssl/certificate.pem", pems.cert);

console.log("SSL certificates created in ssl/ folder!");
