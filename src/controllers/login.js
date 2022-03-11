const {read,hash} = require("../util")
async function POST (req,res){
    try {
        res.setHeader("Access-Control-Allow-Origin", "*")
        let {username, password} = await req.body

        username = username.trim()
        password = password.trim()

        if (!username || username.length > 50 || username.length < 3) {
            throw new Error("Invalid Username")
        }
        if (!password || password.length > 20 || password.length < 6) {
            throw new Error("Invalid Password")
        }

        const users = read("users")

        let user = users.find(el => el.username === username && el.password === password)

        if (user) {
            // res.writeHead(200, {
            //     "Content-Type": "application/json"
            // })
            res.setHeader("Content-Type", "application/json")
            return res.end(JSON.stringify({user_id: hash(`${user.user_id}`)}))
        }
        // res.writeHead(200, {
        //     "Content-Type": "application/json"
        // })
        res.setHeader("Content-Type", "application/json")

        return res.end(JSON.stringify({
            message: "Incorrect username or password"
        }))
    }
    catch (e) {
        // res.writeHead(200,{"Content-Type": "application/json"})
        res.setHeader("Content-Type", "application/json")
        return res.end(JSON.stringify({
            message: e.message
        }))
    }
}
module.exports = {
    POST
}