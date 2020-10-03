const express = require('express');
const router = express.Router();

let cityList = require("../current.city.list.json");

function sortArr(newArr) {
    return newArr.sort((obj1, obj2) => {
        if (obj1.name < obj2.name) return -1;
        if (obj1.name > obj2.name) return 1;
        return 0;
    });
};


class UserLocation {
    constructor(city, country, errCity, errCountry) {
        this.city = city;
        this.country = country;
        this.errCity = errCity;
        this.errCountry = errCountry;
    }

    set setCity(newCity) {
        if (typeof newCity === "string" && newCity !== "") {
            this.errCity = '';
            this.city = newCity.replace(/^./, newCity[0].toUpperCase());;
        } else {
            this.errCity = "Enter your city.";
        }
    }
    set setCountry(newCountry) {
        if (typeof newCountry === "string" && newCountry !== "") {
            this.errCountry = '';
            this.country = newCountry.toUpperCase();
        } else {
            this.errCountry = "Enter your country.";
        }
    }

    findeUserLocation(arrWithData) {
        let arrOfCity = arrWithData.filter((item) =>
            item.name.includes(this.city)
        );
        if (arrOfCity.length == 0) this.errCity = 'No such city found.'
        let arrOfCityAndCountry = arrOfCity.filter((item) =>
            item.country.includes(this.country)
        );
        if (arrOfCityAndCountry.length == 0) this.errCountry = 'No such country found.';
        let result = arrOfCityAndCountry.map((item) => {
            return {
                name: item.name,
                country: item.country,
                lon: item.coord.lon,
                lat: item.coord.lat,
            };
        });
        return result
    };

};

let UserData = new UserLocation();

router.get('/', (req, res, next) => {
    UserData.setCity = req.query.city;
    UserData.setCountry = req.query.country;
    const result = UserData.findeUserLocation(cityList)
    if (UserData.errCity || UserData.errCountry) {
        res.status(200).json({
            error: {
                errCity: UserData.errCity,
                errCountry: UserData.errCountry
            }
        });
    } else {
        res.status(200).json({
            data: result,
        });
    };


});


module.exports = router;