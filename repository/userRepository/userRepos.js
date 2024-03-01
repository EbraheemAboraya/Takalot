const User = require('../../module/helpSekeerSchema/helpseeker');

const getUserByID = async (id) => {
    try {
        const user = await User.findById(id);
        return user;
    } 
    catch{
        return false;
    }
};

const addUser = async userData => {
    try {
        const newUser = new User(userData);
        await newUser.save();
        return newUser;
    } 
    catch (error) {
        console.error("Error saving user:", error);
        throw error;    
    }
};


const udpateUser = async (id, newData) => {
    try {
        const user = await User.findByIdAndUpdate(id,newData);
        return user;
    } 
    catch (error) {
        console.error("Error saving user:", error);
        throw error;    
    }
};

const deleteUser = async id => {
    try {
        const user = await User.findByIdAndDelete(id);
        return user;
    } 
    catch (error) {
        console.error("Error saving user:", error);
        throw error;    
    }
};

const gettAllUsers = async id => {
    try {
        const users = await User.find();
        return users;
    } 
    catch (error) {
        console.error("Error saving user:", error);
        throw error;    
    }
};

const checkUser = async (userName, password) => {
    try {
        let isMatch = true;
        const user = await User.findOne({ userName });
        if (!user){
            return false
        }
        if(password === user.password) {
             isMatch = true;
        } 
        else {
             isMatch = false;
        }
            return { isMatch, userId: user._id };
    } 
    catch (error) {
        console.error("Error verifying user:", error);
        throw error;
    }
};

const getName_Number = async _id => {
    try {
        const user = await User.findById(_id);
            return {fullName:user.fullName,phoneNumber:user.phoneNumber};
    } 
    catch (error) {
        throw error;    
    }
};



async function getUserFullName(userId) {
    try {
        const user = await User.findById(userId).exec(); // Use User model to find user by ID
        if (!user) {
            console.log('User not found');
            return null; // Or throw an error depending on your error handling strategy
        }
        return user.fullName; // Return the full name of the user
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error; // Or handle it more gracefully depending on your application's needs
    }
}




module.exports = {
    getUserByID,
    addUser,
    udpateUser,
    deleteUser,
    gettAllUsers,
    checkUser,
    getName_Number,
    getUserFullName
};