BBBS.Alpha
==========

BBBS - Team Alpha

Live Site URL: https://amber-fire-6558.firebaseapp.com/

This project is deployed to firebase hosting with every git push. If something goes wrong, firebase hosting allows quick rollbacks.

Firebase REST API URL: https://amber-fire-6558.firebaseIO.com/[path/to/json/object].json

Example for posting data:
____________________
Method: PUT 
URL: https://amber-fire-6558.firebaseIO.com/data.json 
Data: { "first": "Jack", "last": "Sparrow" } (application/json)

Response: { "first": "Jack", "last": "Sparrow" }
_____________________


Method: GET
URL: https://amber-fire-6558.firebaseIO.com/data.json

Response: { "first": "Jack", "last": "Sparrow" }

______________________

Method: POST
URL: https://amber-fire-6558.firebaseIO.com/data/events.json 
Data: 
{
	"title":"Swimming at Deep Eddy Pool",
    "description":"This is one of the coolest places to swim in Austin!",
    "address": {
    	"street1":"1234 Some St.",
        "street2":"",
        "city":"Austin",
        "state":"TX",
        "zip":"78759"
    },
    "location": {
    	"lat":"30.276490",
        "lon":"-97.773513"
    },
    "datebegin":"1401554084654",
    "dateend":"1401654084654",
    "interval":null,
	"agerange": "Elementary (6 to 10)",
    "pricerange": "$$ ($10 - $25)",
    "category": ["physical-intense"],
    "rating": 3,
    "picture":"http://upload.wikimedia.org/wikipedia/commons/a/ac/DeepEddyPoolBySteveHopson.jpg",
    "url":"http://www.austinparks.org/our-parks.html?parkid=245",
    "approved": true
}

Response: {"name": "-JOIJTxJyZKBGNFk1JD5"}

______________________

Method: GET
URL: https://amber-fire-6558.firebaseIO.com/data.json
Response: (after posting the same even three times)
{
    "-JOIIt-7UBf0VyioHSpM": {
        "location": {
            "lat": "30.276490",
            "lon": "-97.773513"
        },
        "address": {
            "city": "Austin",
            "street2": "",
            "state": "TX",
            "zip": "78759",
            "street1": "1234 Some St."
        },
        "dateend": "1401654084654",
        "datebegin": "1401554084654",
        "rating": 3,
        "approved": true,
        "url": "http://www.austinparks.org/our-parks.html?parkid=245",
        "description": "This is one of the coolest places to swim in Austin!",
        "category": [
            "physical-intense"
        ],
        "title": "Swimming at Deep Eddy Pool",
        "pricerange": "$$ ($10 - $25)",
        "agerange": "Elementary (6 to 10)",
        "picture": "http://upload.wikimedia.org/wikipedia/commons/a/ac/DeepEddyPoolBySteveHopson.jpg"
    },
    "-JOIJTxJyZKBGNFk1JD5": {
        "location": {
            "lat": "30.276490",
            "lon": "-97.773513"
        },
        "address": {
            "city": "Austin",
            "street2": "",
            "state": "TX",
            "zip": "78759",
            "street1": "1234 Some St."
        },
        "dateend": "1401654084654",
        "datebegin": "1401554084654",
        "rating": 3,
        "approved": true,
        "url": "http://www.austinparks.org/our-parks.html?parkid=245",
        "description": "This is one of the coolest places to swim in Austin!",
        "category": [
            "physical-intense"
        ],
        "title": "Swimming at Deep Eddy Pool",
        "pricerange": "$$ ($10 - $25)",
        "agerange": "Elementary (6 to 10)",
        "picture": "http://upload.wikimedia.org/wikipedia/commons/a/ac/DeepEddyPoolBySteveHopson.jpg"
    },
    "-JOII_RViT5dV1rmwvuY": {
        "location": {
            "lat": "30.276490",
            "lon": "-97.773513"
        },
        "address": {
            "city": "Austin",
            "street2": "",
            "state": "TX",
            "zip": "78759",
            "street1": "1234 Some St."
        },
        "dateend": "1401654084654",
        "datebegin": "1401554084654",
        "rating": 3,
        "approved": true,
        "url": "http://www.austinparks.org/our-parks.html?parkid=245",
        "description": "This is one of the coolest places to swim in Austin!",
        "category": [
            "physical-intense"
        ],
        "title": "Swimming at Deep Eddy Pool",
        "pricerange": "$$ ($10 - $25)",
        "agerange": "Elementary (6 to 10)",
        "picture": "http://upload.wikimedia.org/wikipedia/commons/a/ac/DeepEddyPoolBySteveHopson.jpg"
    }
}
