const reqRepository = require("../../repository/requestRepostiory/requesRepos");
const { NotFoundError, BadRequsetError } = require("../../errors/err");
const req = require("../../module/reuqestsSchema/request");
const multer = require("multer");
const technicalRep = require("../../repository/technicalReoistory/technicalRepos");
const offerRep = require("../../repository/offerRepository/offerRepos");
const { getParameter } = require("../usersController/usersControllers");
const nodemailer = require("nodemailer");
const Techincal = require("../../module/technicalDataSchema/techincal");
const upload = multer({ dest: "uploads/" });
const TechnicianSocketMapping = require("../../module/technicalCategoryMapping");
const mongoose = require("mongoose");
require("dotenv").config();
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const twilio = require("twilio");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const setupSocket = require("../../sockets/socketManager");
const { server } = require("../../app");
const { notifyTechnicianById } = setupSocket(server);

// Function to send SMS
async function sendSMS(to, body) {
  const client = new twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  try {
    const message = await client.messages.create({
      body: body,
      to: to, // Text this number
      from: process.env.TWILIO_PHONE_NUMBER, // From a valid Twilio number
    });
    console.log(`SMS sent! ID: ${message.sid}`);
  } catch (error) {
    console.error(`Failed to send SMS:`, error);
  }
}

async function notifyRelevantTechnicals(matchingTechnicals, newRequest) {
  for (const technical of matchingTechnicals) {
    const msg = {
      to: technical.email, // recipient email from the technical document
      from: "aminw999mn@gmail.com", // Verified sender email in SendGrid
      subject: `New Request Available in ${newRequest.category}`, // Subject line
      text: `Hello ${technical.fullName},\n\nA new request in your category "${newRequest.category}" has been opened. Details: ${newRequest.details}`, // Plain text body
      html: `<p>Hello <b>${technical.fullName}</b>,</p><p>A new request in your category "<b>${newRequest.category}</b>" has been opened. Details: ${newRequest.details}</p>`, // HTML body content
    };

    try {
      await sgMail.send(msg);
      console.log(`Email sent to ${technical.fullName}`);

      console.log(
        `Looking for techSocketMapping with technicianId: ${technical._id}`
      );
      const techSocketMapping = await TechnicianSocketMapping.findOne({
        technicianId: technical._id,
      });

      matchingTechnicals.forEach((technician) => {
        notifyTechnicianById(technician._id.toString(), "newRequest", {
          title: `New Request in ${newRequest.category}`,
          message: `A new request in your category "${newRequest.category}" has been opened. Details: ${newRequest.details}`,
          requestId: newRequest._id,
          category: newRequest.category,
          details: newRequest.details,
        }).catch((error) => {
          console.error(
            `Error sending notification to technician ${technician._id}:`,
            error
          );
        });
      });
    } catch (error) {
      console.error(
        `Failed to send notification to ${technical.fullName}:`,
        error
      );
    }
  }
}

// Controller method for uploading image
const request_post = async (req, res) => {
  try {
    if (req.file && req.file.path) {
      const formData = new FormData();
      formData.append("image", fs.createReadStream(req.file.path));
      // Proceed with sending the file to the Flask app
    } else {
      // Handle the case where the file is not uploaded
      console.log("No file uploaded.");
      // You might want to return an error response here
    }

    const req_id = req.body.req_id;
    if (req_id) {
      req_delete_byId(req_id);
    }
    const helpseekerId = getParameter("helpseekerID");
    const { category, details } = req.body;
    // Save the image to the database using the repository
    const newReq = await reqRepository.addReq({
      helpseekerId,
      image: {
        filename: req.file.originalname,
        contentType: req.file.mimetype,
        image: req.file.buffer,
      },
      category,
      details,
    });
    const matchingTechnicals = await Techincal.find({
      category: newReq.category,
    });
    if (matchingTechnicals && matchingTechnicals.length > 0) {
      await notifyRelevantTechnicals(matchingTechnicals, newReq);
      // Send SMS to matching technicals
      // matchingTechnicals.forEach(technical => {
      // const smsBody = `Hello ${technical.fullName}, you have a new request in your category "${newReq.category}". Check your email or our platform for details.`;
      // sendSMS(technical.phoneNumber, smsBody); // Assuming technical has a phoneNumber field
      // });
    } else {
      console.log("No matching technicals found for category:", category);
    }

    // if (tech.isMatch === true) {
    //   const requestID = newReq._id;
    //   const technicalID = tech.technical_id;
    //   const chReq = await techReqRepo.addRequest({ requestID, technicalID });
    //   if (!chReq) throw new BadRequsetError(`Offer implement is not true`);
    // }
    res.redirect("/home/helpseeker");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error uploading image");
  }
};

const renderUploadForm = async (req, res) => {
  try {
    // Assuming 'name' is the field by which you want to retrieve the image
    const imageName = req.params.name; // Assuming the name is passed as a parameter

    // Retrieve the latest uploaded image from MongoDB based on the name
    const latestImage = await req
      .findOne({ filename: imageName })
      .sort({ _id: -1 });

    // Render the upload form along with the latest image data
    res.render("upload", { latestImage: latestImage });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving image");
  }
};

// add new request to db
const getReqPage = async (req, res) => {
  try {
    res.render("requestform");
  } catch (err) {
    return res.status(err?.status || 500).json({ message: err.message });
  }
};

// get all request in db
const getReqByID = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await reqRepository.getReqById(id);
    if (!request || request.length === 0) throw new NotFoundError("Request");
    return res.status(200).send(request);
  } catch (err) {
    return res.status(err?.status || 500).json({ message: err.message });
  }
};

// update request
const req_update = async (req, res) => {
  try {
    const requestID = req.body.requestID;
    res.render("requestform", { requestID });
  } catch (err) {
    return res.status(err?.status || 500).json({ message: err.message });
  }
};

// delete request
const req_delete = async (req, res) => {
  try {
    const requestId = req.body.requestID;

    const deletedReq = await reqRepository.deleteReq(requestId);
    if (!deletedReq || deletedReq.length === 0)
      throw new NotFoundError("Request");
    const deleteOffer = await offerRep.deleteOfferbyReqId(requestId);
    if (!deleteOffer || deleteOffer.length === 0)
      throw new NotFoundError("Request in offers");
    res.redirect("/home/helpseeker/requests");
  } catch (err) {
    return res.status(err?.status || 500).json({ message: err.message });
  }
};

// delete request by send id
const req_delete_byId = async (reqId) => {
  try {
    const deletedReq = await reqRepository.deleteReq(reqId);
    if (!deletedReq) throw new NotFoundError("Request");
    const deleteOffer = await offerRep.deleteOfferbyReqId(reqId);
    if (!deleteOffer) throw new NotFoundError("Request in offers");
  } catch (err) {
    console.error(err);
    throw err; // Rethrow the error to be caught in the calling function
  }
};

// get all request in db
const getAllReq = async (req, res) => {
  try {
    const req = await reqRepository.gettAllReq();
    if (!req || req.length === 0) throw new NotFoundError("Request");
    return res.status(200).send(req);
  } catch (err) {
    return res.status(err?.status || 500).json({ message: err.message });
  }
};

module.exports = {
  request_post,
  getReqByID,
  req_update,
  req_delete,
  getAllReq,
  getReqPage,

  // uploadImage,
  renderUploadForm,
};
