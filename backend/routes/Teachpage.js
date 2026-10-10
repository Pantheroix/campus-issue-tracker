const express = require("express");
const authmiddleware = require("../middleware/midauth");
const { connection } = require("../database.js");

const router = express.Router();

router.get("/api/teach/issues", authmiddleware, (req, res) => {
  const role = req.user.role;

  if (role != "Teacher") {
    return res.status(403).send("unauthorised");
  }
  const query = ` select u.uname as name,
    u.urole as role,
    i.issue_id as issue_id,
    i.title as title,
    i.description as description,
    i.category as category,
    i.location as location,
    i.status as status 
    from issues i join users2 u 
    on u.uid=i.uid ;`;

  connection.query(query, (err, result) => {
    if (err) {
      return res.status(500).send("database error");
    }
    if (result) {
      res.json({
        message: "fetched successfully",
        data: result || [],
      });
    } else {
      res.status(400).send({ message: "bad request" });
    }
  });
});

router.get(
  "/api/teach/issues/:issue_id/comments",
  authmiddleware,
  (req, res) => {
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
  },
);

router.post(
  "/api/teach/issues/:issue_id/comments/add",
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

router.put("/api/teach/issues/:issue_id/status", authmiddleware, (req, res) => {
  const issue_id = req.params.issue_id;
  const { status } = req.body;

  const query = "UPDATE issues SET status = ? WHERE issue_id = ?";

  connection.query(query, [status, issue_id], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        message: "Database error",
      });
    }

    return res.status(200).json({
      message: "Status updated successfully",
    });
  });
});
module.exports = router;
