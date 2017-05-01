var express = require('express');
var router = express.Router();

router.get('/casteljau', function(req, res, next) {
	res.json([
		{ x: -22, y: 13 },
		{ x: 0, y: 10 },
		{ x: 12, y: -1 }
	]);
});

module.exports = router;
