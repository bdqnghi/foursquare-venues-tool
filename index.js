var foursquare = (require('foursquarevenues'))('YRNDDQNYU0JM1PQJVBVBB3CRTRMD0P3XOZA4SGHTX2JKC50H', 'P5N3MCPUNBZMYZNPTIY2IC4DJ030P2CVJU50BP2QATWRPWTF');

var params = {
	'll': '40.7,-74'
};

foursquare.getVenues(params, function (error, venues) {
	if (!error) {
		console.log(JSON.stringify(venues));
	}
});

foursquare.exploreVenues(params, function (error, venues) {
	if (!error) {
		console.log(JSON.stringify(venues));
	}
});
