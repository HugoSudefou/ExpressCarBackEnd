const Geoloc = require ('./Geoloc');


Geoloc.getLocalisationData('73 rue Henri Litolff 92270 France').then(data => console.log(data));