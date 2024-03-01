const userRepository = require('../../repository/userRepository/userRepos');
const techRepository = require('../../repository/technicalReoistory/technicalRepos');
const reqRepository = require('../../repository/requestRepostiory/requesRepos');
const offersRep = require('../../repository/offerRepository/offerRepos');
const { NotFoundError, BadRequsetError } = require('../../errors/err');
const { LocalStorage } = require('node-localstorage');
const localStorage = new LocalStorage('./scratch');



// Function to save a parameter
function saveParameter(key, value) {
  localStorage.setItem(key, value);
  console.log(`Saved ${value} for key ${key}`);
}
// Function to retrieve a parameter
function getParameter(key) {
  const value = localStorage.getItem(key);
  if (value) {
      console.log(`Retrieved ${value} for key ${key}`);
      return value;
  } else {
      console.log(`No value found for key ${key}`);
      return null;
  }
}



// get all offers for helpsekeer
const getOffers = async (req, res) => {
  try {
    const helpseekerId = getParameter('helpseekerID');
    const requests = await reqRepository.getRequestByUserID(helpseekerId);
    if (!requests) throw new NotFoundError("Requests");

    const allOffers = await Promise.all(requests.map(async (request) => {
      // Retrieve offers associated with the current request
      return await offersRep.getofferByReqId(request._id);
    }));
    if (!allOffers) throw new NotFoundError("offers");


    
    const technicalIDs = allOffers.flatMap(offers => offers.map(offer => offer.technicalID));

    // Retrieve technical details for the extracted technicalIDs
    const technicalDetails = await Promise.all(technicalIDs.map(async (technicalID) => {
      return await techRepository.getTechincalById(technicalID);
    }));
       res.render('helpsekeerOffers',{allOffers,requests,technicalDetails});
  } 
  catch (err) {
    res.status(err?.status || 500).json({ message: err.message });
  }
};

// add new User to db
const user_post = async (req, res) => {
  try {
    const new_user = await userRepository.addUser(req.body);
    if (!new_user) throw new BadRequsetError(`User implement is not true`);
       res.redirect('/login');

  } 
  catch (err) {
    res.status(err?.status || 500).json({ message: err.message });
  }
};


// get all User in db
const getUserByID = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userRepository.getUserByID(id);
    if (!user || user.length === 0) throw new NotFoundError('User');
    return res.status(200).send(user);
  } 
  catch (err) {
    return res.status(err?.status || 500).json({ message: err.message });
  }
};


// get signup page
const getSignup = async (req, res) => {
  try {
      res.render('userSignup');
  } 
  catch (err) {
    return res.status(err?.status || 500).json({ message: err.message });
  }
};

const getLogin = async (req, res) => {
  try {
    res.render('pages-login');
  } catch (err) {
    return res.status(err?.status || 500).json({ message: err.message });
  }
};


const getProfile =async (req, res) => {
  try {
    res.render('profile');
  } catch (err) {
    return res.status(err?.status || 500).json({ message: err.message });
  }
};


const post_Login = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const user = await userRepository.checkUser(userName, password);

    if (!user) {
      const technical = await techRepository.checkUser(userName, password);
      if (!technical) {
        res.redirect('/login');
      } else {
        saveParameter('technicalId', `${technical.technicalId}`);
        res.redirect('/home/technical');
      }
    } else {
      saveParameter('helpseekerID', `${user.userId}`);

      res.redirect('/home/helpseeker');
    }
  } catch (err) {
      return res.status(err?.status || 500).json({ message: err.message });
  }
};



const getUserPage = async (req, res) => {
  try {
     res.render('index');
  }
  catch (err) {
    return res.status(err?.status || 500).json({ message: err.message });
  }
}


const getRequests = async (req, res) => {
  try {
    const helpseekerId = getParameter('helpseekerID');
    const userData = await userRepository.getName_Number(helpseekerId);
    const requests = await reqRepository.getRequestByUserID(helpseekerId);
     res.render('request',{userData,requests});
  }
  catch (err) {
    return res.status(err?.status || 500).json({ message: err.message });
  }
}

// update user
const user_update = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userRepository.udpateUser(id,req.body);
    if (!user || user.length === 0) throw new NotFoundError('User');
    return res.status(200).send(user);
  } 
  catch (err) {
    return res.status(err?.status || 500).json({ message: err.message });
  }
};

// delete user
const user_delete = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userRepository.deleteUser(id);
    if (!user || user.length === 0) throw new NotFoundError('User');
    return res.status(200).send(user);
  } 
  catch (err) {
    return res.status(err?.status || 500).json({ message: err.message });
  }
};


// get all User in db
const getName_Number = async _id => {
  try {
    const userData = await userRepository.getName_Number(_id);
    if (!userData || userData.length === 0) throw new NotFoundError('User');
    return userData;
  } 
  catch (err) {
    return res.status(err?.status || 500).json({ message: err.message });
  }
};


const acceptOffer = async (req, res) => {
  try {
    let requestID = req.body.offerRequestID;
    requestID = requestID.replace(/`/g, '');

    const status = "approved";
    const updateReqStatus = await reqRepository.udpateReq(requestID, status); 
    if (!updateReqStatus)BadRequsetError("Request status error");
    const updateOfferStatus = await offersRep.udpateOffer(requestID,{status});
    if (!updateOfferStatus)BadRequsetError("offer status error");
    res.redirect('/home/offers');
  } catch (err) {
    return res.status(err?.status || 500).json({ message: err.message });
  }
};




module.exports = {
  user_post,
  getUserByID,
  getSignup,
  user_update,
  user_delete,
  getLogin,
  post_Login,
  getName_Number,
  getUserPage,
  saveParameter,
  getParameter,
  getRequests,
  getProfile,
  getOffers,
  acceptOffer
};