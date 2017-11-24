var byResultController = require("./byResultController");
var byCandidateController = require("./byCandidateController");
var topSectionController = require("./topSectionController");
var sectionDifferenceController = require("./sectionDifferenceController");
var projectionController = require("./projectionController");
var projectionV2Controller = require("./projectionV2Controller");
var projectionV3Controller = require("./projectionV3Controller");
var projectionV4Controller = require("./projectionV4Controller");
var pollingProjectionController = require("./pollingProjectionController");
var pollingProjectionV2Controller = require("./pollingProjectionV2Controller");
var sectionChangePartyController = require("./sectionChangePartyController");
var express = require('express');
var router = express.Router();

var controllers = {};

controllers.init = function(app) {
    byResultController.init(app, router);
    byCandidateController.init(app, router);
    topSectionController.init(app, router);
    sectionDifferenceController.init(app, router);
    projectionController.init(app, router);
    projectionV2Controller.init(app, router);
    projectionV3Controller.init(app, router);
    projectionV4Controller.init(app, router);
    sectionChangePartyController.init(app, router);
    pollingProjectionController.init(app, router);
    pollingProjectionV2Controller.init(app, router);
    app.use('/cityhall', router);
};

module.exports = controllers;