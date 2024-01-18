const express = require("express");
const router = express.Router();

const { register, login, token } = require("../controller/auth");

router.route("/").get(token);

// disabled it for the demo
// router.route("/register").post(register);

router.route("/login").post(login);

module.exports = router;
