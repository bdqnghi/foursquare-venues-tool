var express = require('express');
var foursquare = (require('foursquarevenues'))('YRNDDQNYU0JM1PQJVBVBB3CRTRMD0P3XOZA4SGHTX2JKC50H', 'P5N3MCPUNBZMYZNPTIY2IC4DJ030P2CVJU50BP2QATWRPWTF');
var _ = require('underscore');
var async = require('async');
var pg = require('pg');
var request = require('request');
var conString = 'postgres://localhost/we_trip';
var client = new pg.Client(conString);
var token = 'AVBSER51DCJ5OORVGBY3VNDDCZGF3RPGSJJURSFWUETXTEAM';
var params = {
	'll': '10.8231,106.6297'
};

var router = express.Router();

function handleRes (res, body, callback) {
	if (res.statusCode >= 300) {
		return callback(body, null);
	} else {
		return callback(null, JSON.parse(body));
	}
}

function getVenue (params, callback) {
	var urlString = 'https://api.foursquare.com/v2/venues/' + params.venue_id + '?' + 'oauth_token=' + token + '&' + 'v=20160528';
	return request(urlString, function (error, response, body) {
		return handleRes(response, body, callback);
	});
}

router.get('/venue/explore', (req, res) => {
	params.query = req.query.term;
	foursquare.exploreVenues(params, function (error, venues) {
		if (!error) {
			console.log(JSON.stringify(venues));
		}
		return res.status(200).json(venues);
	});

});

router.get('/venue/search', (req, res) => {
	params.query = req.query.term;
	foursquare.getVenues(params, function (error, venues) {
		if (!error) {
			console.log(JSON.stringify(venues));
		}
		return res.status(200).json(venues);
	});

});

router.get('/venue/:id', (req, res) => {
	params.venue_id = req.params.id;
	var save = req.query.save || 'false';

	getVenue(params, function (error, response) {
		var venue = response.response.venue;

		if (save === 'true') {
			console.log('Save to database');
			client.connect(function (err) {
				if (err) {
					return console.error('could not connect to postgres', err);
				}
				// INSERT INTO places (id, name, location_id, rating, latitude, longitude, vicinity, description, region_id, default_budget, created_at, updated_at) VALUES (1, 'Công viên nước Đầm Sen', 'ChIJlw0hwZgudTERz8OwnvH2O6w', 4.3, 10.7689894, 106.6359362, '3 Hòa Bình, Phường 3', 'Quam esse aut exercitationem commodi. Quae dolore velit aut quas repudiandae. Animi nostrum quas rerum earum at blanditiis. Quia odit nihil tempore fugiat modi quis et adipisci. Sapiente saepe accusantium et impedit aut rerum maiores. Qui voluptatibus repellat eveniet aut. Aspernatur mollitia omnis maxime rerum quis in voluptatem qui. Quia neque praesentium libero perspiciatis maxime fugiat est aliquid. Optio velit doloremque pariatur necessitatibus ut omnis. Neque deleniti possimus dicta enim ea reiciendis. Laudantium et culpa et minus. Ut quis velit doloremque aliquid vel voluptatem. Qui magni recusandae voluptas sit. Aut voluptatem autem aut in et ut at. Debitis pariatur deleniti aut consequatur doloribus hic vitae ex. Ratione et omnis laboriosam qui dolor. Quia porro laborum consectetur est. Eum possimus dolore consequatur occaecati. Quidem sed illo totam temporibus. Consequatur iste rerum voluptas illum totam omnis non.', 1, 555112, '2016-04-25 01:29:03.211833', '2016-04-25 01:29:03.211833');
				client.query(
					'INSERT INTO places (name, location_id, rating, latitude, longitude, vicinity, description, region_id, default_budget, created_at, updated_at)' +
					'values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)',
					[venue.name, venue.id, venue.rating, venue.location.lat, venue.location.lng, venue.location.address, null, null, null, new Date(), new Date()],
					function (err, result) {
						if (err) {
							return console.error('error running query', err);
						}
						client.end();
					});
			});
		}
		return res.status(200).json(venue);
	});

});

module.exports = router;
