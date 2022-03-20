'use strict'
const FakeExpress = require("./src/lib")
const PORT = process.env.PORT || 4000

const app = FakeExpress()

const users = require("./src/controllers/users")
const login = require("./src/controllers/login")
const userAct = require("./src/controllers/userAct")
const register = require("./src/controllers/register")
const messages = require("./src/controllers/messages")

app.post("/login", login)
app.get("/users",users.GET)
app.post("/register",register)
app.get('/userAct',userAct.GET)
app.post("/users",users.DELETE)
app.get("/messages",messages.GET)
app.post("/messages",messages.POST)

app.listen(PORT,() => {
    console.log("Server is running at http://192.168.1.2:"+PORT)
})
