const path = require("path")
const fs = require("fs")
const jwt = require("jsonwebtoken")
/**
 * @param text{string}
 * @param salt{string}
 * @returns {string}
 */
function hash (text, salt="Abror"){
    return jwt.sign(text, salt)
}
/**
 *
 * @param encoded{string}
 * @param salt{string}
 * @returns {string}
 */
function unhash(encoded, salt="AbrorAli"){
    return jwt.decode(encoded,salt)
}
/**
 *
 * @param fileName{string}
 * @returns {any|*[]}
 */
function read(fileName){
    try{
        const data = fs.readFileSync(path.join(process.cwd(),"src","db",fileName+".json"),"utf-8")
        return JSON.parse(data) || []
    }
    catch (err){
        throw err
    }
}

/**
 *
 * @param fileName{string}
 * @param data{Object}
 * @returns {boolean}
 */
function write(fileName,data){
    try {
        fs.writeFileSync(path.join(process.cwd(),"src", 'db', fileName + '.json'), JSON.stringify(data, null, 4))
        return true
    } catch(error) {
        throw error
    }
}

/**
 *
 * @param token{string}
 * @returns {number}
 */
function isUser(token){
    try{
        let user = unhash(token)
        console.log(user)
        let users = read("users")
        user = users.find(el => el.user_id === user.user_id && el.password === user.password)
        if(!user){
            return 0
        }
        return user.user_id
    }
    catch (e) {
        return 0
    }

}

/**
 *
 * @param id{Number}
 * @returns {boolean}
 */
function isCorrectId(id){
    try {
        let users = read("user")
        if(!id || isNaN(+id)) return false
        let user = users.find(el => el.user_id === id)
        return !!user;
    }
    catch (e){
        return false
    }
}

module.exports = {
    hash,
    unhash,
    isCorrectId,
    read,
    write,
    isUser
}