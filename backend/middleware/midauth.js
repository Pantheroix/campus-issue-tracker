const jwt = require("jsonwebtoken");
const JWT_SCERET = "12345";

const authmiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    res.status(401).send("invalid token");
    return;
  }
  try {
    const data = jwt.verify(token, JWT_SCERET);
    req.user = data;
    next();
  } catch (err) {
    console.log(err);
    res.status(400).send("invalid token");
  }
};

module.exports = authmiddleware;
