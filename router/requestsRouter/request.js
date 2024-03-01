const express = require('express');
const router = express.Router();
const reqController = require('../../controllers/requsetController/requestcontrller');
const uploadMiddleware = require('../../Middleware/img'); 

// request routes
router.get("/request/:id", reqController.getReqByID);
router.get("/request", reqController.getAllReq);
router.post("/request", reqController.request_post);
router.post("/request/update", reqController.req_update);
router.post("/request/delete", reqController.req_delete);

// home request routes
router.get("/home/request", reqController.getReqPage);
router.post("/home/request", uploadMiddleware.single('image'), reqController.request_post);

module.exports = router;
