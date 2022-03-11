const FakeExpress = require("./src/lib")
const PORT = process.env.PORT || 4000

const app = FakeExpress()
const login = require("./src/controllers/login")

app.post("/login", login)

app.listen(PORT,() => {
    console.log("Server is running at http://192.168.1.2:"+PORT)
})
