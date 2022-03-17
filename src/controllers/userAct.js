'use strict'

const {read,isUser} = require("./../util")

const GET = async (req, res) => {
    try {
        res.setHeader("Access-Control-Allow-Origin", "*")
        let userAct = read("userAct")
        let users = read("users")
        let user = req.query
        let user_id = isUser(user.user)

        if (!user_id) throw new Error("Not User")

        let forUser = userAct.find(users => users.user_id === user_id)
        users = users.filter(el => forUser.contact?.includes(el.user_id))
        res.json({
            status: 200,
            userAct: users
        })

    } catch (e) {
        return res.json({
            // status:403,
            message: e.message
        },403)
    }
}
module.exports = {
    GET
}