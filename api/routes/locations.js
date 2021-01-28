const express = require("express");
const router = express.Router();
const Location = require("../models/locations");
const Controller = require("../controllers/locations");
const checkAuth = require('../middleware/check-auth');
const isEmpty = require('../middleware/isEmpty');


// Get all Locations and add pagination
router.get("/", checkAuth, async (req, res) => {
  let locations;
  if (req.query.page) {
    locations = await Controller.getLocationsbyPages(req.query.page);
  } else {
    locations = await Controller.getAllLocations();
  }
  if(isEmpty(locations.results)){
      return res.status(400).json({error: "Bad request", "status": 400});
  }
  res.json(locations);
});

// Create a new Location
router.post("/", checkAuth, async (req, res) => {
  const location = new Location(req.body);
  const savedLocation = await Controller.postLocation(location);
  res.json(savedLocation);
});

// Get a specific Location or multiple Locations
router.get("/:id", checkAuth, async (req, res) => {
  let result;
  if (req.params.id.search(",")>0) {
    const arr = req.params.id.split`,`.map((x) => +x);
    if(arr.includes(NaN)){
        return res.status(400).json({error: "Bad request", "status": 400});
    }
    result = await Controller.getMultipleLocations(arr);
  } else {
    if(isNaN(parseInt(req.params.id))){
      return res.status(400).json({error: "Bad request", "status": 400});
    }
    result = await Controller.getSpecificLocation(req.params.id);
  }

  res.json(result);
});

// Update a Location
router.patch("/:id", checkAuth, async (req, res) => {
  const location = await Controller.updateLocation(req.params.id, req.body);
  res.json(location);
});

// Delete a Location
router.delete("/:id", checkAuth, async (req, res) => {
  const location = await Controller.deleteLocation(req.params.id);
  res.json(location);
});

module.exports = router;
