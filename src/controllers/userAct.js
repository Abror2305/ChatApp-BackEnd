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

        let contacts = userAct.find(users => users.user_id === user_id)?.contact

        let result = []
        if(!contacts) contacts = []
        for (let contact of contacts) {
            let user = users.find(el => el.user_id === contact)
            result.push({
                user_id: user.user_id,
                username: user.username,
                avatar: user.avatar
            })
        }

        res.json({
            status: 200,
            userAct: result
        })

    } catch (e) {
        return res.json({
            // status:403,
            message: e.message
        },400)
    }
}
module.exports = {
    GET
}