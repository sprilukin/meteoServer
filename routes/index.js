var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {title: 'Express'});
});

/* GET Userlist page. */
router.get('/meteo', function(req, res) {
    var db = req.db;
    var collection = db.get('bl999SensorCollection');
    collection.find({}, {}, function(e, docs) {
        res.render('bl999SensorList', {
            "sensorInfoCollection": docs
        });
    });
});

router.get('/meteo/json', function(req, res) {
    var db = req.db,
        query = req.query.q ? JSON.parse(decodeURIComponent(req.query.q)) : {},
        order = req.query.order ? JSON.parse(decodeURIComponent(req.query.order)) : {},
        offset = req.query.offset ? Number(req.query.offset) : 0,
        limit = req.query.limit ? Number(req.query.limit) : 100,
        projection = {
            limit : limit,
            skip : offset,
            sort : order
        };

    var collection = db.get('bl999SensorCollection');

    collection.count(query, function(e, total) {
        collection.find(query, projection, function(e, docs) {
            res.setHeader('content-type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('total', total);
            res.send(docs);
        });
    });
});

/* POST to Add User Service */
router.post('/meteo', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var channel = req.body.channel;
    var powerUUID = req.body.powerUUID;
    var battery = req.body.battery;
    var temperature = req.body.temperature;
    var humidity = req.body.humidity;

    console.log("headers: ", req.headers);
    console.log("channel: ", channel);
    console.log("powerUUID: ", powerUUID);
    console.log("battery: ", battery);
    console.log("temperature: ", temperature);
    console.log("humidity: ", humidity);

    // Set our collection
    var collection = db.get('bl999SensorCollection');

    // Submit to the DB
    collection.insert({
        "channel": Number(channel),
        "powerUUID": Number(powerUUID),
        "battery": Number(battery),
        "temperature": Number(temperature),
        "humidity": Number(humidity),
        "date": new Date()
    }, function(err, doc) {
        if (err) {
            // If it failed, return error
            res.send(500, "There was a problem adding the information to the database.");
        } else {
            // And forward to success page
            res.send("Created");
        }
    });
});

module.exports = router;
