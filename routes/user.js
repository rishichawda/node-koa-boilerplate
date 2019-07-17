const router = require("express").Router();

const authService = require('services/authService');

router.get("/", authService.required, function(req, res) {
  return res.json({ user: "user profile route" });
});

module.exports = router;
