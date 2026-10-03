const express = require("express");
const bcrypt = require("bcryptjs");
const webtoken = require("jsonwebtoken");

const JWT_SCERET = "12345";

const { connection } = require("../database.js");

const router = express.Router();

router.post("/api/login", async (req, res) => {
  const { uemail, upassword } = req.body;

  const query =
    "select uid,uname, uemail,upassword,urole from users2 where uemail=?";

  connection.query(query, [uemail], async (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("database error");
      return;
    }
    const check = await bcrypt.compare(upassword, result[0].upassword);

    const Mpayload = {
      uid: result[0].uid,
      name: result[0].uname,
      email: result[0].uemail,
      role: result[0].urole,
    };

    const payload = {
      name: result[0].uname,
      email: result[0].uemail,
      role: result[0].urole,
    };

    const token = webtoken.sign(Mpayload, JWT_SCERET);
    if (result.length > 0 && check) {
      res.json({ message: "login successful", token: token, payload: payload });
    } else {
      res.status(400).send("invalid Email or Password");
    }
  });
});

router.post("/api/register", async (req, res) => {
  const { uname, uemail, urole, upassword } = req.body;
  const salt = await bcrypt.genSalt(10);
  const newpassword = await bcrypt.hash(upassword, salt);
  const query =
    "insert into users2(uname,uemail,urole,upassword) values(?,?,?,?)";

  connection.query(
    query,
    [uname, uemail, urole, newpassword],
    (err, result) => {
      if (err) {
        res.status(500).send("Database error");
      }
      if (result) {
        res.json({
          message: "Account created",
          user: result,
        });
      } else {
        res.status(400).send("Enter correct credentials");
      }
    },
  );
});

module.exports = router;
