'use strict'

const {read, isUser} = require("../util");

function GET(req, res){
    try {
        res.setHeader("Access-Control-Allow-Origin", "*")
        let chats = read("chats")


        let user = req.query
        let from_id = +user.from_id
        if(!from_id || isNaN(from_id)) throw new Error("from_id is invalid or not found")

        let user_id = isUser(user.user)
        if(!user_id) throw new Error("Not User")

        let chat = chats.filter( el => el.user_id === user_id && el.from_id === from_id ||
                            el.user_id === from_id && el.from_id === user_id)

        res.json({
            chats: chat
        })
    }catch (e) {
        res.json({
            message: e.message
        },400)
    }
}

module.exports = {
    GET
}