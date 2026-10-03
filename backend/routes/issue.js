const express = require("express");
const authmiddleware = require("../middleware/midauth.js");
const { connection } = require("../database.js");

const router = express.Router();

router.post("/api/issues", authmiddleware, (req, res) => {
  const { title, description, category, location } = req.body;

  const uid = req.user.uid;

  if (!title || !description || !category || !location) {
    res.send("Fill all the give options.");
    return;
  }

  const query =
    "insert into issues(title,description,category,location,uid) values(?,?,?,?,?)";

  connection.query(
    query,
    [title, description, category, location, uid],
    (err, result) => {
      if (err) {
        res.status(500).send("databse error");
        return;
      }

      if (result) {
        res.json({
          message: "issue created successfully",
          data: result,
        });
      } else {
        res.status(400).send({ message: "something went wrong" });
      }
    },
  );
});

router.get("/api/fetch/issues", authmiddleware, (req, res) => {
  const uid = req.user.uid;

  const query = "select * from issues where uid=?";

  connection.query(query, [uid], (err, result) => {
    if (err) {
      return res.status(500).send("database error");
    }
    if (result.length > 0) {
      res.json({
        message: "fetched success",
        fdata: result,
      });
    } else {
      res.status(400).send({ message: "bad request" });
    }
  });
});

router.get("/api/issues/:issue_id/comments", authmiddleware, (req, res) => {
  const issue_id = req.params.issue_id;

  const query = `
    SELECT c.c_id, c.comment, c.created_at, u.uname AS name, u.urole AS role
    FROM comments c
    JOIN users2 u ON c.uid = u.uid
    WHERE c.issue_id = ?
    ORDER BY c.created_at ASC
  `;

  connection.query(query, [issue_id], (err, result) => {
    if (err) {
      console.log("Comments fetch error:", err);
      return res.status(500).json({ message: "database error" });
    }

    return res.json({
      message: "success",
      data: result || [],
    });
  });
});

router.post(
  "/api/issues/:issue_id/comments/add",
  authmiddleware,
  (req, res) => {
    const uid = req.user.uid;

    const issue_id = req.params.issue_id;

    const { comment } = req.body;

    if (!comment) {
      return res.send("comments can not be empty");
    }

    const query = "insert into comments(issue_id,uid,comment) values(?,?,?)";
    connection.query(query, [issue_id, uid, comment], (err, result) => {
      if (err) {
        return res.status(500).send("databse error");
      }
      if (result.length > 0) {
        res.json({
          message: "comment inserted",
          data: result,
        });
      }
    });
  },
);

module.exports = router;
