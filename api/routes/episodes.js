const express = require("express");
const router = express.Router();
const Episode = require("../models/episodes");
const Controller = require("../controllers/episodes");

// Get all Episodes and add pagination
router.get("/", async (req, res) => {
  let episodes;
  if (req.query.page) {
    episodes = await Controller.getEpisodesbyPages(req.query.page);
  } else {
    episodes = await Controller.getAllEpisodes();
  }

  res.json(episodes);
});

// Create a new Episode
router.post("/", async (req, res) => {
  const episode = new Episode(req.body);
  const savedEpisode = await Controller.postEpisode(episode);
  res.json(savedEpisode);
});

// Get a specific Episode or multiple Episodes
router.get("/:id", async (req, res) => {
  let result;
  if (req.params.id.search(",")) {
    const arr = req.params.id.split`,`.map((x) => +x);
    result = await Controller.getMultipleEpisodes(arr);
  } else {
    result = await Controller.getSpecificEpisode(req.params.id);
  }

  res.json(result);
});

// Update an Episode
router.patch("/:id", async (req, res) => {
  const episode = await Controller.updateEpisode(req.params.id, req.body);
  res.json(episode);
});

// Delete an Episode
router.delete("/:id", async (req, res) => {
  const episode = await Controller.deleteEpisode(req.params.id);
  res.json(episode);
});

module.exports = router;
