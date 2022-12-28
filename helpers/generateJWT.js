const jwt = require('jsonwebtoken');

const generateJWT = (email = '') => {
    return new Promise((resolve, reject) => {
        const payload = {email};
        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '900s'
        }, (err, token) => {
            if(err){
                console.log(err);
                reject('cannot generate the token please check the backen')
            }else{
                resolve(token);
            }
        })
    })
}

module.exports ={
    generateJWT,
}