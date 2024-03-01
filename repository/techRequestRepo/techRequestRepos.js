const techRequestModel = require('../../module/techRequest/tecReqeust');
const ReqModel = require('../../module/reuqestsSchema/request');
const userRepository = require('../../repository/userRepository/userRepos');
const Offer = require('../../module/offersSchema/offer');

const getReqById = async (technicalID) => {
    try {
        const techReqs = await techRequestModel.find({ technicalID: technicalID });
        return techReqs;
    } catch (error) {
        console.error('Error fetching TechRequests by technicalID:', error);
        throw error; // Rethrow or handle as needed
    }
};






const gettAlltechSchema = async () => {
    try {
        const allTechReq = await techRequestModel.find();
        return allTechReq;
    } 
    catch {
        return false;
    }
};


const deletetechSchema = async technicalID => {
    try {
        const deletedTech = await techRequestModel.findOneAndDelete({technicalID});
        return true;
    } 
    catch {
        return false;
    }
};


const addRequest = async requestData => {
    try {
        const newReq = new techRequestModel(requestData);
        await newReq.save();
        return newReq;
    } 
    catch {
        return false;
    }
};





const getData = async technicalID => {
    try {
        const requestTech = await techRequestModel.find({ technicalID });//requestID+technicalID
        const requestUser = await ReqModel.find(requestTech.requestID);

        const helpseekerPromises = requestUser.map(request => {
         return userRepository.getUserByID(request.helpseekerId);
       });
         const helpseekers = await Promise.all(helpseekerPromises);
         const offers = await Offer.find({technicalID});
        return {requestTech,helpseekers,requestUser,offers};
    } 
    catch{
        return false;
    }
};


module.exports = {
    getReqById,
    deletetechSchema,
    gettAlltechSchema,
    addRequest,
    getData
};