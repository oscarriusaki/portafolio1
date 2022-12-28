const path = require("path");
const { db } = require("../database/config");
const { response } = require("../router/err");

const getHeros = async (req, res = response) => {
    const pg = await db;
    const id_user_logged = req.user.id_user;
    const sql = 'select * from hero where estado = $1 and id_user = $2 order by id_hero desc';
    pg.query(sql, [ true, id_user_logged], (err, result) => {
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
                return res.status(200).json(result.rows)
            }else{
                return res.status(404).json({
                    msg: 'no hero found'
                })
            }
        }
    })
}
const getHero = async (req, res = response) => {
    const pg = await db;
    const { id } = req.params;
    const id_user_logged = req.user.id_user;
    const sql = 'select * from hero where id_hero = $1 and estado = $2 and id_user = $3';
    pg.query(sql, [ id, true, id_user_logged], (err, result) => {
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
                return res.status(400).json({
                    msg: `no hero with id ${id}`
                })
            }
        }
    })
}

const postHero = async(req, res = response) => {
    const pg = await db;
    const {idd, superhero, publisher, alter_ego, first_appearance, characters} = req.body;
    const sql = `insert into hero (id_user, estado, fecha, idd, superhero, publisher, alter_ego, first_appearance, characterss, originalname, image, pathimage) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`;
    const id_user = req.user.id_user;
    const yy = new Date().getFullYear();
    const mm = new Date().getMonth() + 1;
    const dd = new Date().getDate();

    pg.query(sql, [ id_user, true, (yy+"/"+mm+"/"+dd), idd, superhero, publisher, alter_ego, first_appearance, characters, req.file.originalname, req.file.filename,`http://localhost:8080/hero/image/${req.file.filename}`], (err, result) => {
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
                    msg: 'registeres successfully'
                })
            }else{
                return res.status(400).json({
                    msg: 'there was an error with the query'
                })
            }
        }
    })
}
const putHero = async(req, res = response) => {
    const pg = await db;
    const id_user_logged = req.user.id_user;

    const {id_hero, idd, superhero, publisher, alter_ego, first_appearance, characterss } = req.body;
    const sql = 'update hero set idd= $1, superhero= $2, publisher= $3, alter_ego= $4, first_appearance= $5, characterss= $6 where id_hero = $7 and estado = $8 and id_user = $9';
    pg.query(sql, [idd, superhero, publisher, alter_ego, first_appearance, characterss, id_hero, true, id_user_logged],(err, result) => {
        if(err) {
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
                res.status(200).json({
                    msg: 'successfully updated'
                })
            }else{
                return res.status(400).json({
                    msg: 'there was an error in the query'
                })
            }
        }
    })
    

}
const deleteHero = async (req, res = response) => {
    const pg = await db;
    const { id } = req.params;
    const id_user_logged = req.user.id_user;
    const sql = 'update hero set estado = $1 where id_hero = $2 and estado = $3 and id_user = $4';

    pg.query(sql, [ false, id, true, id_user_logged], (err, result) => {
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
                    msg: 'sucessfully eliminated'
                })
            }else{
                return res.status(404).json({
                    msg: 'no hero found'
                })
            }
        }
    })
}
const getImageULR = async (req, res = response) => {
    const pg = await db;
    const { id } = req.params;
    const sql = 'select * from hero where image = $1 and estado = $2';
    pg.query(sql , [id, true ] , (err, result) => {
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
            console.log(result);
            if(result.rowCount === 1){
                return res.sendFile(path.join(__dirname, "../images/"+result.rows[0].image))
            }else{
                return res.status(404).json({
                    msg: 'not found image'
                })
            }
        }
    })
}

module.exports = {
    getHeros,
    getHero,
    postHero,
    putHero,
    deleteHero,
    getImageULR
}
