const jwt = require("jsonwebtoken")

console.log(jwt.sign({id: 1, role: "ADMIN"}, "access"))