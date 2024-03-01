const express = require('express');
const router = express.Router();
const offerController = require('../../controllers/offersController/offerController');
//offer
router.get("/offer/:id", offerController.getOfferByID);
router.get("/offer", offerController.getAllOffer);
router.post("/offer", offerController.offer_post);
router.put("/offer/:id", offerController.offer_update);
router.delete("/offer/:id", offerController.offer_delete);

module.exports = router;
