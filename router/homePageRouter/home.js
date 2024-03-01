const express = require('express');
const router = express.Router();
const homeController = require('../../controllers/homeController/homecontroller');
//home

router.get("/home",homeController.getHomePage);

// router.post("/home",);



module.exports = router;