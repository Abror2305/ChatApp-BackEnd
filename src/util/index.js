const path = require("path")
const fs = require("fs")
const jwt = require("jsonwebtoken")
const crypto = require('crypto');
const createHash = crypto.createHash;

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
function hashPasswd(txt) {
    return createHash('sha256')
        .update(txt)
        .digest('hex')
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
 * @param deletedAccount{boolean}
 * @returns {boolean}
 */
function isCorrectId(id,deletedAccount=true){
    try {
        let users = read("users")
        if(!id || isNaN(+id)) return false
        let user = findUser(users,+id)
        if(deletedAccount) return !!(user?.password && user?.age);
        return !!user
    }
    catch (e){
        return false
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
function removeUserAct(data,user_id,from_id){
    let senderUser = findUser(data,user_id)
    if(!senderUser) return data
    let userIndex = senderUser.contact.indexOf(from_id)
    senderUser.contact.splice(userIndex,1)
    return data
}

/**
 *
 * @param data
 * @param id
 * @returns {*}
 */
function findUser(data,id){
    return data.find(el =>el.user_id === id)
}

module.exports = {
    read,
    hash,
    write,
    isUser,
    addAct,
    findUser,
    hashPasswd,
    isCorrectId,
    removeUserAct
}