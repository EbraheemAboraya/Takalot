const reqRepository = require('../../repository/offerRepository/offerRepos');
const { NotFoundError, BadRequsetError } = require('../../errors/err');


// add new offer to db
const offer_post = async (req, res) => {
  try {
    const new_Offr = await reqRepository.addOffer(req.body);
    if (!new_Offr) throw new BadRequsetError(`Offer implement is not true`);
       return res.status(200).json(new_Offr);
  } 
  catch (err) {
    res.status(err?.status || 500).json({ message: err.message });
  }
};

// get all offer in db
const getOfferByID = async (req, res) => {
  try {
    const { id } = req.params;
    const offer = await reqRepository.getOfferById(id);
    if (!offer || offer.length === 0) throw new NotFoundError('Offer');
    return res.status(200).send(offer);
  } 
  catch (err) {
    return res.status(err?.status || 500).json({ message: err.message });
  }
};


// update offer
const offer_update = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedOffer = await reqRepository.udpateOffer(id, req.body);
    if (!updatedOffer || updatedOffer.length === 0) throw new NotFoundError('Offer');
    return res.status(200).send(updatedOffer);
  } 
  catch (err) {
    return res.status(err?.status || 500).json({ message: err.message });
  }
};


// delete offer
const offer_delete = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedOffer = await reqRepository.deleteOffer(id);
    if (!deletedOffer || deletedOffer.length === 0) throw new NotFoundError('Offer');
    return res.status(200).send(deletedOffer);
  } 
  catch (err) {
    return res.status(err?.status || 500).json({ message: err.message });
  }
};


// get all offer in db
const getAllOffer = async (req, res) => {
  try {
    const offer = await reqRepository.gettAllOffer();
    if (!offer || offer.length === 0) throw new NotFoundError('Offer');
    return res.status(200).send(offer);
  } 
  catch (err) {
    return res.status(err?.status || 500).json({ message: err.message });
  }
};




module.exports = {
offer_post,
getOfferByID,
offer_update,
offer_delete,
getAllOffer
};