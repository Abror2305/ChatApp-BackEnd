'use strict'
const {read,hash,write} = require("../util")

module.exports = async (req,res) => {
    try {
        res.setHeader("Access-Control-Allow-Origin", "*")
        let {username, age, password} = await req.body

        let users = read("users") || []

        let user = users.find(user => user.username === username)

        if (user) {
            throw new Error("This username is already taken")
        }
        if (!password || password.length < 6 || password.length > 32) {
            throw new Error("The password length must be more than 6 and less than 32")
        }
        if (isNaN(+age) || age < 12 || age > 100) {
            throw new Error("Age must be greater than 12 and less than 100")
        }

        let newUser = {
            user_id: users.at(-1)?.user_id + 1 || 1,
            username,
            age,
            password
        }
        users.push(newUser)

        write("users", users)
        res.json({
            status: 200,
            user_id: hash(newUser.user_id)
        })
    }
    catch (e) {
        res.json({
            status:403,
            message: e.message
        })
    }
}