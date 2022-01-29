const express = require('express');
const router = express.Router();
const { saveTime, deleteTime, getTime } = require("./../controllers/time");

router.get('/getTime', getTime);
router.post('/saveTime', saveTime);
router.delete('/deleteTime', deleteTime);

module.exports = router;