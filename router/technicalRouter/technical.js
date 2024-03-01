const express = require('express');
const router = express.Router();
const technicalController = require('../../controllers/technicalController/technicalcontroller');
//technical
router.get("/technical/:id", technicalController.getTechincalByID);
router.get("/technical", technicalController.getAllTechincal);
router.put("/technical/:id", technicalController.techincal_update);
router.delete("/deleteOffer", technicalController.deleteOffer);


router.get("/home/technical", technicalController.getTechPage);

router.get("/signup/technical",technicalController.getSignup);
router.post("/signup/technical", technicalController.techincal_post);

router.get("/techhome/request",technicalController.getrequestspage);

router.get("/home/techincal_profile",technicalController.gettechincalprofile);

router.get("/tech/offers",technicalController.getOffersPage);
router.post("/tech/addOffer",technicalController.addOffer);

router.post("/tech/updateOffer",technicalController.update_offer);


module.exports = router;
