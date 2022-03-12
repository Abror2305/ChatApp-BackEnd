'use strict'
const FakeExpress = require("./src/lib")
const PORT = process.env.PORT || 4000

const app = FakeExpress()
const login = require("./src/controllers/login")
const register = require("./src/controllers/register")
const users = require("./src/controllers/users")

app.get("/users",users.GET)
app.post("/login", login)
app.post("/register",register)


app.listen(PORT,() => {
    console.log("Server is running at http://192.168.1.2:"+PORT)
})
