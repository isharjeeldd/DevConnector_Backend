const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const User = require("../../models/User")
const jwt = require("jsonwebtoken")
const config = require("config")

//@route        GET, POST, DELETE, PUT api/users
//@desc         Test route
//@access       Public
router.post("/", [
    check('name', 'name is required').not().isEmpty(),
    check('email', 'email is required').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength(6)
], async (req, res) => {
    const errors = validationResult(req);

    // if any of the validation fails we return response 
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;
    try {

        // see if the user exists
        // fetch user gravatar
        // encrypt user password
        // return jsonWebToken

        let user = await User.findOne({ email })
        if (user) {
            // if exist send response of user exists
            return res.status(400).json({ errors: [{ msg: "User already exists" }] });
        }

        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        })

        user = new User({
            name,
            email,
            avatar,
            password
        })

        // create a variable for hashing
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

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
