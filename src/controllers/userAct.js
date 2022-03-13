'use strict'

const {read,isUser} = require("./../util")

const GET = async (req, res) => {
    try {
        res.setHeader("Access-Control-Allow-Origin", "*")
        let userAct = read("userAct")

        let user = req.query
        let user_id = isUser(user.user)

        if (!user_id) throw new Error("Not User")

        let forUser = userAct.find(users => users.user_id === user_id)

        res.json({
            status: 200,
            userAct: forUser
        })

    } catch (e) {
        res.statusCode = 403
        return res.json({
            // status:403,
            message: e.message
        })
    }
}
module.exports = {
    GET
}