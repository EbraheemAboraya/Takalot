const Offer = require("../../module/offersSchema/offer");
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");

const getOfferById = async (id) => {
  try {
    const offer = await Offer.findById(id);
    return offer;
  } catch {
    return false;
  }
};

const addOffer = async (requestID, technicalID, bid, comments) => {
  try {
    const newOffer = new Offer({ requestID, technicalID, bid, comments });
    await newOffer.save();
    return newOffer;
  } catch {
    return false;
  }
};

const udpateOffer = async (requestID, newData) => {
  try {
    const offer = await Offer.findOneAndUpdate({ requestID }, newData);
    return offer;
  } catch (error) {
    return false;
  }
};

const deleteOffer = async (id) => {
  try {
    const offer = await Offer.findOneAndDelete({ requestID, technicalID });
    return true;
  } catch {
    return false;
  }
};

const gettAllOffer = async (technicalID) => {
  try {
    const offers = await Offer.find({ technicalID });
    return offers;
  } catch {
    return false;
  }
};

const getOffersByTechID = async (technicalID) => {
  try {
    const offers = await Offer.find({ technicalID });
    return offers;
  } catch (err) {
    throw err;
  }
};

const calculateRevenueLastMonth = async (technicalID) => {
  try {
    console.log(`+++++assasas ${technicalID}`);
    const startOfLastMonth = new Date();
    startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1);
    startOfLastMonth.setDate(1);
    startOfLastMonth.setHours(0, 0, 0, 0);

    const endOfLastMonth = new Date();
    endOfLastMonth.setMonth(endOfLastMonth.getMonth());
    endOfLastMonth.setDate(0); // Corrected to ensure it's the last day of the previous month
    endOfLastMonth.setHours(23, 59, 59, 999);

    const totalRevenueLastMonth = await Offer.aggregate([
      {
        $match: {
          technicalID: new ObjectId(technicalID), // Convert to ObjectId
          // status: 'approved',
          // approvedDate: { $gte: startOfLastMonth, $lte: endOfLastMonth }
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$bid" },
        },
      },
    ]);

    return totalRevenueLastMonth[0] ? totalRevenueLastMonth[0].totalRevenue : 0;
  } catch (err) {
    console.error("Error calculating revenue last month:", err);
    throw err;
  }
};

const calculateApprovedOffersCurrentWeek = async (technicalID) => {
  try {
    // Calculate the start and end of the current week
    const now = new Date();
    const firstDayOfWeek = new Date(
      now.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1))
    ); // Adjust for Sunday being 0
    firstDayOfWeek.setHours(0, 0, 0, 0);

    const lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
    lastDayOfWeek.setHours(23, 59, 59, 999);

    const approvedOffersThisWeek = await Offer.aggregate([
      {
        $match: {
          technicalID: new ObjectId(technicalID), // Convert to ObjectId
          // status: 'approved',
          // approvedDate: { $gte: firstDayOfWeek, $lte: lastDayOfWeek }
        },
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
        },
      },
    ]);

    // Return the count of approved requests, or 0 if none were found
    return approvedOffersThisWeek[0] ? approvedOffersThisWeek[0].count : 0;
  } catch (err) {
    throw err;
  }
};





const getAnyFiveOffers = async (technicalID) => {
    try {
      const anyFiveOffers = await Offer.aggregate([
        { $match: { technicalID: new ObjectId(technicalID) }}, // Match offers by technicalID
        { $limit: 5 } // Limit to the first 5 offers found
      ]);
  
      // Since we're directly fetching documents, there's no need for a $group stage like in the count example
      // Check if offers are found and return them, or return an empty array if none were found
      return anyFiveOffers.length > 0 ? anyFiveOffers : [];
    } catch (err) {
      console.error("Failed to retrieve offers:", err);
      throw err;
    }
  };



  /**
 * Gets the requestID for a given offerId.
 * @param {String} offerId The ID of the offer document.
 * @returns {Promise<mongoose.Schema.Types.ObjectId>} A promise that resolves to the requestID if found, or null if not found.
 */
  async function getRequestIdByOfferId(offerId) {
    if (!mongoose.Types.ObjectId.isValid(offerId)) {
      throw new Error('Invalid offerId');
    }
  
    try {
      const offer = await Offer.findById(offerId).exec();
      if (!offer) {
        console.log('Offer not found');
        return null;
      }
      return offer.requestID;
    } catch (error) {
      console.error('Error fetching Offer:', error);
      throw error; // or handle it as you see fit
    }
  }





const deleteOfferbyReqId = async (requestID) => {
  try {
    const offers = await Offer.deleteMany({ requestID });
    console.log(offers);
    return true;
  } catch {
    return false;
  }
};

const getofferByReqId = async (requestID) => {
  try {
    const offers = await Offer.find({ requestID });
    return offers;
  } catch {
    return false;
  }
};


module.exports = {
  getOfferById,
  addOffer,
  udpateOffer,
  deleteOffer,
  gettAllOffer,
  getOffersByTechID,
  calculateRevenueLastMonth,
  calculateApprovedOffersCurrentWeek,
  getAnyFiveOffers,
  getRequestIdByOfferId,
  deleteOfferbyReqId,
  getofferByReqId,
};
