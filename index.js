'use strict'
const FakeExpress = require("./src/lib")
const PORT = process.env.PORT || 4000

const app = FakeExpress()

const users = require("./src/controllers/users")
const login = require("./src/controllers/login")
const userAct = require("./src/controllers/userAct")
const register = require("./src/controllers/register")
const messages = require("./src/controllers/messages")

app.get('/userAct',userAct.GET)
app.get("/users",users.GET)
app.get("/messages",messages.GET)
app.post("/login", login)
app.post("/register",register)
app.post("/messages",messages.POST)

app.listen(PORT,() => {
    console.log("Server is running at http://192.168.1.2:"+PORT)
})
