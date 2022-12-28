const { Pool } = require('pg');

const database = process.env.DATABASE  || 'heroe4'
const user = process.env.USER  || 'postgres'
const password = process.env.PASSWORD  || '00000000'
const host = process.env.HOST  || 'lohost'
const port = process.env.PORTT  || '5432'
const max = process.env.MAX  || '20'

const db = new Pool({
    database:database ,
    user:user ,
    password:password ,
    host:host ,
    port:port ,
    max:max ,
})

module.exports = {
    db
}