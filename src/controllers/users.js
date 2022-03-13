'use strict'

const {read,isUser} = require("./../util")

const GET = async (req, res) => {
    try{
        res.setHeader("Access-Control-Allow-Origin", "*")
        let users = read("users")

        let user = req.query
        let user_id = isUser(user.user)

        if(!user_id) throw new Error("Not User")

        let username;

        let forUser = []
        for (let usr of users) {
            if(user_id === usr.user_id) {
                username = usr.username
                continue
            }
            forUser.push({
                user_id: usr.user_id,
                username: usr.username
            })
        }


        res.json({
            status:200,
            users: forUser,
            user_id,
            username
        })
    }
    catch (e) {
        return res.json({
            status:403,
            message: e.message
        })
    }
}
module.exports = {
    GET
}