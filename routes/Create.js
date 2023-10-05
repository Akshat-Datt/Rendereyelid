const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtSecret = "AaafafvdgargaegWQWQSfsvebtafebadbrtatbae";

router.post(
  "/",
  [
    body("email").isEmail(),
    body("first").isLength({ min: 4 }),
    body("last").isLength({ min: 3 }),
    body("user").isLength({ min: 5 }),
    body("password").isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const salt = await bcrypt.genSalt(10);
    let secPassword = await bcrypt.hash(req.body.password, salt);
    try {
      await User.create({
        first: req.body.first,
        last: req.body.last,
        user: req.body.user,
        email: req.body.email,
        password: secPassword,
      }).then(res.json(req.body));
    } catch (error) {
      console.log(error);
    }
  }
);

router.post(
  "/login",
  [body("email").isEmail(), body("password").isLength({ min: 5 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let email = req.body.email;
    try {
      let userData = await User.findOne({email});
      if(!userData){
        return res.status(400).json({ errors: "Try logging in with correct credentials" });
      }
      const compPass = await bcrypt.compare(req.body.password, userData.password);
      if(!compPass){
        return res.status(400).json({ errors: "Try logging in with correct credentials" });
      }
      const data = {
        user:{
          id: userData.id
        }
      }
      const authToken = jwt.sign(data, jwtSecret);
      return res.json({ success: true, authToken: authToken });
    } catch(e) {
      console.log(e);
    }
  }
);

module.exports = router;
