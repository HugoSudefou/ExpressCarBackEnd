const axios = require('axios');

const checkIsAResult = response =>{
    if(response.data.status != "OK")
        throw Error('Address was not found');
    return response;
};
var extractFirstResult = response => response.data.results[0];

const checkHasStreetNumber = result => {
    if (result.address_components[0].types[0] != 'street_number')
        throw Error('Incomplete Address');
    return result
};

const extractAddressData = result => {
    const addressComponents = result.address_components;
    const location = result.geometry.location;
    return {
        address: addressComponents[0].long_name + " "+ addressComponents[1].long_name,
        postalCode: addressComponents[6].long_name,
        city: addressComponents[2].long_name,
        country: addressComponents[5].long_name,
        longitude: location.lng,
        latitude: location.lat
    }
};
const Geoloc = {
    getLocalisationData: (address) => axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
            params: {
                address: address.replace(/\s/g, '+'),
                key: 'AIzaSyBh-ZMhtx_g97Xs2ZLBryqd8ldApqo_veI'
            }
        })
        .then(checkIsAResult)
        .then(extractFirstResult)
        .then(checkHasStreetNumber)
        .then(extractAddressData)
};

module.exports = Geoloc;