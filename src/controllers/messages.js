'use strict'

const {read, isUser,isCorrectId, write, findUser} = require("../util");

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
function addAct(data,user_id,from_id){
    let senderUser = findUser(data,user_id)

    if(!senderUser){
        data.push({
            user_id,
            contact: [from_id]
        })
        return data
    }
    if(!senderUser.contact.includes(from_id)){
        senderUser.contact.unshift(from_id)
        return data
    }
    let index = senderUser.contact.indexOf(from_id)
    if(~index){
        senderUser.contact.splice(index,1)
        senderUser.contact.unshift(from_id)
        return data
    }
}
module.exports = {
    GET,
    POST
}