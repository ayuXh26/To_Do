const validator = require('validator');
const regex = /\d/;

const validateSignUpData = (req) => {
    const{firstName, lastName, email, password} = req.body;

    if(!firstName){
        throw new Error('First name is required');
    } else if(regex.test(firstName)){
        throw new Error("First Name must contain only letters");
    }

    else if(regex.test(lastName)){
        throw new Error("Last Name must contain only letters");
    }

    else if(!validator.isEmail(email)){
        throw new Error("Please enter a valid email address");
    }

    else if(!validator.isStrongPassword(password)){
        throw new Error("Password must be between 6 to 12 characters and must contain " +
            "uppercase letter, lowercase letter, number and special characters.");
    }
}

const validateLoginData = (req) => {

    const{email, password} = req.body;

    try{
        if(!validator.isEmail(email)){
            throw new Error("Please enter a valid email");
        }

    }
    catch(err){
        console.log("Error: ", err);
    }

}

module.exports = {
    validateSignUpData,
    validateLoginData,
}