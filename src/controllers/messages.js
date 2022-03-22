'use strict'

const {read,
    isUser,
    isCorrectId,
    write,
    findUser,
    addAct,
    removeUserAct
} = require("../util");

function GET(req, res){
    try {
        res.setHeader("Access-Control-Allow-Origin", "*")
        let chats = read("chats")


        let user = req.query
        let from_id = Number(user.from_id)
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

async function POST(req,res){
    try{
        res.setHeader("Access-Control-Allow-Origin", "*")
        let {user,message,from_id} = await req.body
        message = message?.trim()
        let user_id = isUser(user)

        if(!user_id) throw new Error("Not User")
        if(!message) throw new Error("Message is required")
        if(!isCorrectId(from_id)) throw new Error("Deleted Account or Invalid receiverId")
        if(user_id===from_id) throw new Error("You can't write to yourself")

        from_id = Number(from_id)
        let chats = read("chats")

        let newChat = {
            user_id,
            message,
            date: new Date(),
            from_id,
        }
        chats.push(newChat)

        let activities = read("userAct")

        activities = addAct(activities,user_id,from_id)
        activities = addAct(activities,from_id,user_id)

        write("chats",chats)
        write("userAct",activities)
        res.json({
            message: "ok"
        })
    }
    catch (e){
        res.json({
            message:e.message},400)
    }
}

async function DELETE(req,res){
    try {
        res.setHeader("Access-Control-Allow-Origin", "*")
        let {user,from_id} = await req.body

        let user_id = isUser(user)
        if(!user_id) throw new Error("Not User")
        if(!isCorrectId(from_id,false)) throw new Error("Incorrect from_id")

        let chats = read("chats")
        let userAct = read("userAct")

        chats = chats.filter( el => !(el.user_id === user_id && el.from_id === from_id ||
            el.user_id === from_id && el.from_id === user_id))

        userAct = removeUserAct(userAct,user_id,from_id)
        userAct = removeUserAct(userAct,from_id,user_id)

        write("chats",chats)
        write("userAct",userAct)

        res.json({
            message: "Messages successfully deleted"
        })
    }
    catch (e) {
        res.json({
            message: e.message
        },400)
    }
}

module.exports = {
    GET,
    POST,
    DELETE
}