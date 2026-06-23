const express = require('express');
const router = express.Router();
const { checkApi, getAllCars, getCarById } = require('../controllers/carController');

router.get('/check', checkApi);
router.get('/cars', getAllCars);  
router.get('/cars/:id', getCarById);   

module.exports = router;
