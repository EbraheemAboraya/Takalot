// const userRepository = require('../../repository/userRepository/userRepos');
const { NotFoundError, BadRequsetError } = require('../../errors/err');



const getHomePage = async (req, res) => {
    try {
        // const userId = req.session.userId || null;
        const latestImage = null;
        res.render('index', { latestImage }); // Pass userId to the view template
      } catch (err) {
        return res.status(err?.status || 500).json({ message: err.message });
      }
  };
  
  // get get page
  const post_HomePage = async (req, res) => {
    try {
      res.status(200).render('index', { userId: res.userId });
    } 
    catch (err) {
      return res.status(err?.status || 500).json({ message: err.message });
    }
  };


module.exports = {
    getHomePage,
    post_HomePage
}
