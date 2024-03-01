const { request } = require('express');
const Req = require('../../module/reuqestsSchema/request');
const mongoose = require('mongoose');


const getReqById = async (_id) => {
    try {
        const req = await Req.findById(_id);
        return req;
    } 
    catch{
        return false;
    }
};



const udpateReq = async (_id, status) => {
    try {
        
        const updatedReq = await Req.findByIdAndUpdate( _id,  { status: status } );
        return updatedReq;
    } catch (error) {
        console.error("Error updating req:", error);
        throw error;
    }
};


const deleteReq = async id => {
    try {
        const req = await Req.findByIdAndDelete(id);
        return req;
    } 
    catch {
        return false;
    }
};

const gettAllReq = async _id => {
    try {
        const requests = await Req.find(_id);//
        return requests;
    } 
    catch {
        return false;
    }
};

const addReq = async reqData => {
    try {
        const newReq = new Req(reqData);
        
        await newReq.save();

        return newReq;
    } catch (error) {
        console.error("Error saving req:", error);
        throw error;    
    }
};


const getRequestByUserID = async helpseekerId => {
    try {
        const requests = await Req.find({ helpseekerId });
        return requests;
    } 
    catch{
        return false;
    }
};

const getRequestByTechID = async technicalID => {
    try {
        const requests = await Req.find({ technicalID });
        return requests;
    } 
    catch{
        return false;
    }
};





const getRequestDetailsById = async (requestId) => {
    try {
        const request = await Req.findOne(); // Just fetch the first document
        if (!request) {
            console.log('No request found.');
            return null;
        }
        console
        return request.details;
    } catch (err) {
        console.error('Error fetching request details:', err);
        throw err;
    }
};

/**
 * Gets the helpseekerId for a given requestId.
 * @param {String} requestId The ID of the request document.
 * @returns {Promise<String>} A promise that resolves to the helpseekerId if found, or null if not found.
 */
async function getHelpSeekerIdByRequestId(requestId) {
    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      throw new Error('Invalid requestId');
    }
  
    try {
      const request = await Req.findById(requestId).exec();
      if (!request) {
        console.log('Request not found');
        return null;
      }
      return request.helpseekerId;
    } catch (error) {
      console.error('Error fetching Request:', error);
      throw error; // or handle it as you see fit
    }
  }




module.exports = {
    getReqById,
    addReq,
    udpateReq,
    deleteReq,
    gettAllReq,
    getRequestByUserID,
    getRequestByTechID,
    getRequestDetailsById,
    getHelpSeekerIdByRequestId

};