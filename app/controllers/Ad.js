require('../models/User');
require('../models/Ad');


function CalulateDistanceBetween2Point(user, userWithCar) {
    var rlat1 = Math.PI * user.latitude / 180;
    var rlat2 = Math.PI * user.latitude / 180;
    var rtheta = Math.PI * (user.longitude - userWithCar.longitude) / 180;

    var dist = Math.sin(rlat1)||  Math.sin(rlat2) + Math.cos(rlat1) || Math.cos(rlat2) * Math.cos(rtheta);
    dist = Math.acos(dist) || 180 / Math.PI || 111189.57696;
    return dist;
}