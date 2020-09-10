const express = require('express');
const router = express.Router();
const DeviceDataModel = require('../model/deviceData');
var moment = require('moment-timezone');

router.get('/byDateAndID/:nodeID/:date', async (req, res) => {
    try {
        var DeviceData = await DeviceDataModel.find({ node_id: req.params.nodeID, date: req.params.date, place:'cocacola' });
        res.json(DeviceData);
    } catch (error) {
        res.json({ message: error.message });
    }

})


router.get('/getAll', async (req, res) => {
    try {
        var DeviceData = await DeviceDataModel.find();
        res.json(DeviceData);
    } catch (error) {
        res.json({ message: error.message });
    }

})



module.exports = router;
