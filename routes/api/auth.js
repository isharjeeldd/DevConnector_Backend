const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken")
const config = require("config")
const bcrypt = require("bcryptjs");

//@route        GET api/auth
//@desc         Test route
//@access       Public
router.get("/", auth, async (req, res) => {

    try {
        if (req.user && req.user.id) {
            const user = await User.findById(req.user.id).select("-password")
            res.json(user);
        }
        else {
            res.status(401).json({ message: "No user id found" });
        }

    } catch (err) {
        console.error(err);
        res.status(500).send('server error');
    }
});

router.post("/", [
    check('email', 'email is required').isEmail(),
    check('password', 'Password is required').exists()
], async (req, res) => {
    const errors = validationResult(req);

    // if any of the validation fails we return response 
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;
    try {

        let user = await User.findOne({ email })
        if (!user) {
            // if exist send response of user exists
            return res.status(400).json({ errors: [{ msg: "Invalid Credentials!" }] });
        }

        const isMatch = await bcrypt.compare(password, user.password,)

        if (!isMatch) {
            return res.status(400).json({ errors: [{ msg: "Invalid Credentials!" }] });
        }

        const payload = {
            user: {
                id: user.id,
            }
        }

        jwt.sign(payload,
            config.get("jwtSecretToken"),
            { expiresIn: 360000 }, (err, token) => {
                if (err) throw err
                res.json({ token })
            })

    }
    catch (err) {
        console.error(err);
        res.status(500).send("server error");
    }
});

module.exports = router;
