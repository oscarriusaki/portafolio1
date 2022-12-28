const jwt = require('jsonwebtoken');
const { db } = require('../database/config');

const validarJWT = async(req, res, next) => {
    const token = req.header('x-token');
    const pg = await db;
    if(!token){
        return res.status(400).json({
            msg: 'no token provider'
        });
    }
    try{
        const { email } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const sql = 'select * from users where email = $1 and estado = $2';

        pg.query(sql, [ email, true], (err, result) => {
            if(err){
                return res.status(500).json({
                    code: err.code, 
                    name: err.name, 
                    hint: err.hint,
                    detail: err.detail,
                    where: err.where,
                    file: err.file,
                });
            }else{
                if(result.rowCount === 1){
                    req.user = result.rows[0];
                    next();
                }else{
                    return res.status(400).json({
                        msg: `user with email ${email} have estado false`
                    })
                }
            }
        });

    }catch(err){
        console.log(err);
        return res.status(500).json({
            msg: 'token invaid or expired'
        })
    }
}
module.exports = {
    validarJWT,
}