const Geoloc = require('./Geoloc');
const Users = require('../controllers/Users');
var mongoose = require('mongoose'),
    User = mongoose.model('User');

//Geoloc.getLocalisationData('73 rue Henri Litolff 92270 France').then(data => console.log(data));

/*const testUpdate = {
 username: "coco",
 email: "dzadazdzd@gmail.com",


 };*/
const result = value =>{
    return value;
};
var test = {
    testBDD: (value) => User.findOne({email: value}).exec()
        .then(result)

};

test.testBDD("hoho@gmail.com").then(result => console.log("fdsdf"))
    .catch(error => console.error("dazdazzad"));






