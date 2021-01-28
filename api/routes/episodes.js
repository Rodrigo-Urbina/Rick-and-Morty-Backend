const express = require("express");
const router = express.Router();
const Episode = require("../models/episodes");
const Controller = require("../controllers/episodes");
const checkAuth = require('../middleware/check-auth');
const isEmpty = require('../middleware/isEmpty');

// Get all Episodes and add pagination
router.get("/", checkAuth, async (req, res) => {
  let episodes;
  if (req.query.page) {
    episodes = await Controller.getEpisodesbyPages(req.query.page);
  } else {
    episodes = await Controller.getAllEpisodes();
  }

  if(isEmpty(episodes.results)){
      return res.status(400).json({error: "Bad request", "status": 400});
  }
  res.json(episodes);
});

// Create a new Episode
router.post("/", checkAuth, async (req, res) => {
  const episode = new Episode(req.body);
  const savedEpisode = await Controller.postEpisode(episode);
  res.json(savedEpisode);
});

// Get a specific Episode or multiple Episodes
router.get("/:id", checkAuth, async (req, res) => {
  let result;
  if (req.params.id.search(",")>0) {
    const arr = req.params.id.split`,`.map((x) => +x);

    if(arr.includes(NaN)){
        return res.status(400).json({error: "Bad request", "status": 400});
    }

    result = await Controller.getMultipleEpisodes(arr);
  } else {
    if(isNaN(parseInt(req.params.id))){
      return res.status(400).json({error: "Bad request", "status": 400});
    }
    result = await Controller.getSpecificEpisode(req.params.id);
  }

  res.json(result);
});

// Update an Episode
router.patch("/:id", checkAuth, async (req, res) => {
  const episode = await Controller.updateEpisode(req.params.id, req.body);
  res.json(episode);
});

// Delete an Episode
router.delete("/:id", checkAuth, async (req, res) => {
  const episode = await Controller.deleteEpisode(req.params.id);
  res.json(episode);
});

module.exports = router;
