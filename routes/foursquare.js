'use strict';
var express = require('express');
var foursquare = (require('foursquarevenues'))('YRNDDQNYU0JM1PQJVBVBB3CRTRMD0P3XOZA4SGHTX2JKC50H', 'P5N3MCPUNBZMYZNPTIY2IC4DJ030P2CVJU50BP2QATWRPWTF');
var _ = require('underscore');
var async = require('async');
var pg = require('pg');
var conString = 'postgres://localhost/wetrip';

var params = {
	'll': '10.8231,106.6297'
};

var router = express.Router();

router.get('/venue/explore', (req, res) => {
	params.query = req.query.term;
	var save = req.query.save || false;
	foursquare.exploreVenues(params, function (error, venues) {
		if (!error) {
			console.log(JSON.stringify(venues));
		}
		return res.status(200).json(venues);
	});

});

router.get('/venue/search', (req, res) => {
	params.query = req.query.term;
	var save = req.query.save || false;
	foursquare.getVenues(params, function (error, venues) {
		if (!error) {
			console.log(JSON.stringify(venues));
		}
		return res.status(200).json(venues);
	});

});

router.get('/venue/:id', (req, res) => {
	params.venue_id = req.query.id;
	var save = req.query.save || false;
	foursquare.getVenue(params, function (error, venue) {
		if (!error) {
			console.log(JSON.stringify(venue));
		}
		return res.status(200).json(venue);
	});

});

module.exports = router;
