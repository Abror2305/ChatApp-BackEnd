'use strict'

const {read,isUser} = require("./../util")
const {findUser, hashPasswd, write} = require("../util");

const GET = async (req, res) => {
    try{
        res.setHeader("Access-Control-Allow-Origin", "*")
        let users = read("users")

        let user = req.query
        let user_id = isUser(user.user)

        if(!user_id) throw new Error("Not User")

        let username,avatar;

        let forUser = []
        for (let usr of users) {
            if(user_id === usr.user_id) {
                username = usr.username;
                avatar = usr.avatar
                continue;
            }
            if(!usr.age) continue;
            forUser.push({
                user_id: usr.user_id,
                username: usr.username,
                avatar: usr.avatar
            })
        }


        res.json({
            status:200,
            username,
            avatar,
            users: forUser
        })
    }
    catch (e) {
        return res.json({
            status:403,
            message: e.message
        },403)
    }
}
const DELETE = async (req, res) => {
    try {
        res.setHeader("Access-Control-Allow-Origin", "*")
        res.setHeader("Access-Control-Allow-Headers", '*')
        let users = read("users")
        let {user, password} = await req.body


        let user_id = isUser(user)
        if (!user_id) throw new Error("Not User")

        user = findUser(users, user_id)
        if (user.password !== hashPasswd(password)) {
            throw new Error("Incorrect password")
        }
        let userAct = read("userAct")
        userAct = userAct.filter(el => el.user_id !== user_id)
        user.username = "Deleted Account"
        delete user.age
        delete user.password
        user.avatar = "https://static10.tgstat.ru/channels/_0/fc/fc15c8d9f8fe6b79f9778a26e8e03fd4.jpg"
        write("userAct",userAct)
        write("users",users)

        res.json({
            message: "Account successfully deleted"
        })
    }
    catch (e){
        res.json({
            message:e.message
        },400)
    }
}
module.exports = {
    GET,
    DELETE
}