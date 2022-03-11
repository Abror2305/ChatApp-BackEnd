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


module.exports = {
    hash,
    unhash,
    read,
    write
}