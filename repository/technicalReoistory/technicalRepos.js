const Techincal = require('../../module/technicalDataSchema/techincal');

const getTechincalById = async id => {
    try {
        const tech = await Techincal.findById(id);
        return tech;
    } 
    catch{
        return false;
    }
};

const addTechincal = async reqData => {
    try {
        const newTech = new Techincal(reqData);
        await newTech.save();
        return newTech;
    } 
    catch {
        return false;
    }
};


const udpateTechincal = async (id, newData) => {
    try {
        const tech = await Techincal.findByIdAndUpdate(id,newData);
        return tech;
    } 
    catch {
        return false;
    }
};

const deleteTechincal = async id => {
    try {
        const deletedTech = await Techincal.findByIdAndDelete(id);
        return deletedTech;
    } 
    catch {
        return false;
    }
};

const getAllTechincal = async id => {
    try {
        const techs = await Techincal.find();
        return techs;
    } 
    catch {
        return false;
    }
};

const checkCategory = async category => {
    try {
        let isMatch = true;
        const tech = await Techincal.findOne({ category });
        if (!tech){
            return false
        }
        if (category === tech.category) {
             isMatch = true;
        } 
        else {
             isMatch = false;
        }
        return { isMatch, technical_id: tech._id };
    } 
    catch (error) {
        console.error("Error verifying user:", error);
        throw error;
    }
};


const checkUser = async (userName, password) => {
    try {
        let isMatch = true;
        const technical = await Techincal.findOne({ userName });
        if (!technical){
            return false
        }
        if (password === technical.password) {
             isMatch = true;

        } 
        else {
             isMatch = false;
        }
        return { isMatch, technicalId: technical._id };
    } 
    catch (error) {
        console.error("Error verifying user:", error);
        throw error;
    }
};




module.exports = {
    getTechincalById,
    addTechincal,
    udpateTechincal,
    deleteTechincal,
    getAllTechincal,
    checkCategory,
    checkUser,
};