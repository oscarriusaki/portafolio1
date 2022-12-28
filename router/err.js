const express = require('express');
const path = require('path');

const router = express();
router.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../public/404.html'));
});
router.post('*', (req, res) => {
    res.json({
        msg: "wrong parh for post please check it"
    })
});
router.put('*' , (req, res ) => {
    res.json({
        msg: "wrong parh for put please check it"
    })
})
router.delete('*' , (req, res ) => {
    res.json({
        msg: "wrong parh for delete please check it"
    })
})

module.exports = router