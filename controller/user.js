const { response } = require("express");
const { db } = require("../database/config");
const bcryptjs = require('bcryptjs');
const { generateJWT } = require("../helpers/generateJWT");

const getUsers = async (req, res = response) => {
    const pg = await db;
    const sql = 'select * from users where estado = $1 order by id_user desc';
    pg.query(sql, [true], (err, result) => {
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
            if(result.rowCount >= 1){
                return res.status(200).json(
                    result.rows
                )
            }else{
                return res.status(404).json({
                    msg: 'user not found'
                })
            }
        }
    })
}
const getUser = async (req, res = response) => {
    const pg = await db;
    const { id } = req.params;
    const sql = 'SELECT * FROM users where id_user = $1 and estado = $2';
    pg.query(sql , [ id, true] , (err , result) => {
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
                return res.status(200).json(result.rows[0])
            }else{
                return res.status(404) .json({
                    msg: `user not found with the id ${id}`
                })
            }
        }
    })
}
const postUser = async (req, res = response) => {
    const pg = await db;
    const { id_user, ...resto } = req.body;
    const sql = 'select * from users where email = $1';
    const sql2 = 'insert into users (first_name, email, pas, estado, fecha, tokens) values ($1,$2,$3,$4,$5,$6)';

    try{

        pg.query(sql, [ resto.email], async (err, result) => {
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
                if(result.rowCount !== 1){
                    
                    const yy = new Date().getFullYear();
                    const mm = new Date().getMonth() + 1;
                    const dd = new Date().getDate();
                    const token = await generateJWT(resto.email);
                    const salt = bcryptjs.genSaltSync();
                    const pass = bcryptjs.hashSync(resto.pas, salt);

                    pg.query(sql2, [ resto.first_name, resto.email, pass, true, (yy + '/' + mm + '/' + dd), token], (err, result) => {
                        if(err){ 
                            return res.status(500).json({
                                code: err.code, 
                                name: err.name, 
                                hint: err.hint,
                                detail: err.detail,
                                where: err.where,
                                file: err.file,
                            })
                        }else{
                            if(result.rowCount === 1){
                                const sql3 = 'select * from users where email = $1';
                                pg.query(sql3, [resto.email], (err, result) => {
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
                                        if(result.rowCount == 1){
                                            req.user = result.rows[0];
                                            console.log(req.user, 'this is the user');
                                            return res.status(200).json({
                                                msg: 'registered succesfully',
                                                token
                                            })
                                        }else{
                                            return res.status(404).json({
                                                msg: 'data not found'
                                            })
                                        }
                                    }
                                })
                            }else{
                                return res.status(400).json({
                                    msg: 'there was an error during the registration'
                                });
                            }
                        }
                    })

                }else{
                    return res.status(400).json({
                        msg: 'error the email exist'
                    })
                }
            }
        });

    }catch(err){
        console.log(err)
        return res.status(500).json({
            msg: 'internal error please talk to the adminitrator'
        })
    }

}
const putUser = async (req, res = response) => {
    const pg = await db;
    const { id_user, ...resto} = req.body;
    const userCurrently = req.user.email;

    const sql = 'select * from users where email = $1';
    const sql2 = 'update users set first_name = $1, email = $2, pas = $3, fecha = $4, tokens = $5 where email = $6';
    try{
        pg.query(sql, [ resto.email], async (err, result)=> {
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
                if((result.rowCount === 1 && result.rows[0].estado === true && result.rows[0].email === userCurrently) || (result.rowCount === 0)){
                    const yy = new Date().getFullYear();   //  (first_name, email, pas, estado, fecha, tokens)
                    const mm = new Date().getMonth() + 1;
                    const dd = new Date().getDate();
                    const token = await generateJWT(resto.email);
                    const salt = bcryptjs.genSaltSync();
                    const pasGenerate = bcryptjs.hashSync( resto.pas, salt);
                    pg.query(sql2, [ resto.first_name, resto.email, pasGenerate, (yy+'/'+mm+'/'+dd), token, userCurrently], (err, result) => {
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
                                req.user.first_name = resto.first_name;
                                req.user.email = resto.email;
                                req.user.pas = pasGenerate;
                                req.user.fecha =  (yy+'/'+mm+'/'+dd);
                                req.user.tokens = token;

                                console.log(req.user);

                                return res.status(200).json({
                                    msg: 'update successfully',
                                    token
                                })
                            }else{
                                return res.status(400).json({
                                    msg: 'there was an error during the registration'
                                })
                            }
                        }
                    })
                }else{
                    return res.status(400).json({
                        msg: 'the email exist'
                    })
                }
            }
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({
            msg: 'there was an error talk to the adminitrator'
        })
    }
}
const deleteUser = async(req, res = response) => {
    const pg = await db;
    const email = req.user.email;
    const sql = 'select * from users where email = $1 and estado = $2';
    const sql2 = 'update users set estado = $1 where email = $2';
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
                pg.query(sql2, [ false, email], (err, result) => {
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
                            return res.status(200).json({
                                msg: 'eliminated successfully'
                            })
                        }else{
                            return res.status(400).json({
                                msg: 'there was an error during the query'
                            })
                        }
                    }
                })
            }else{
                return res.status(404).json({
                    msg: 'User eliminated'
                })
            }
        }
    })
}

module.exports = {
    getUsers,
    getUser ,
    postUser,
    putUser,
    deleteUser
}
