const { db } = require("../database/config");
const { response } = require("../router/err");
const bcryptjs = require('bcryptjs');
const { generateJWT } = require("../helpers/generateJWT");

const login = async (req, res = response) => {
    const pg = await db;
    console.log(req.body['email']);
    const { email, pas } = req.body;
    const sql = 'select * from users where email = $1 and estado = $2'

    try{

        pg.query(sql, [ email, true], async (err, result) => {
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
                    
                    const p = bcryptjs.compareSync(pas, result.rows[0].pas);
                    const token = await generateJWT(email);

                    if(p){
                        req.user = result.rows[0];
                        req.user.token = token;
                        console.log(req.user, 'this is the user');
                        return res.status(200).json({
                            msg:'successfully logged',
                            token
                        })
                    }else{
                        return res.status(404).json({
                            msg: 'password incorrect'
                        })
                    }

                }else{
                    return res.status(400).json({
                        msg: 'email incorrect'
                    })
                }
            }
        })

    }catch(err){
        console.log(err);
        return res.status(401).json({
            msg: 'error talk to theadminitrator'
        })
    }
}

module.exports = {
    login
}