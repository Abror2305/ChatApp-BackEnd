'use strict'
const {read,hash} = require("../util")

module.exports = async (req, res) => {
    try {
        res.setHeader("Access-Control-Allow-Origin", "*")
        let {username, password} = await req.body

        username = username.trim().toLowerCase()
        password = password.trim()
        if(!(/^(?=[a-zA-Z0-9._]{3,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/.test(username))){
            throw new Error("Incorect username")
        }
        if (!password || password.length > 20 || password.length < 6) {
            throw new Error("Invalid Password")
        }
        password = hash(password)

        const users = read("users")

        let user = users.find(el => el.username === username && el.password === password)

        if (user) {
            return res.json({
                status: 200,
                user: hash(JSON.stringify({
                    user_id: user.user_id,
                    password: user.password
                }))
            })
        }

        return res.json({
            status: 401,
            message: "Incorrect username or password"
        })
    } catch (e) {
        return res.json({
            status: 401,
            message: e.message
        })
    }
}
