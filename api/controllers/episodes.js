const Episode = require("../models/episodes");
const isEmpty = require('../middleware/isEmpty');

module.exports = {
  getAllEpisodes,
  getEpisodesbyPages,
  postEpisode,
  getSpecificEpisode,
  getMultipleEpisodes,
  updateEpisode,
  deleteEpisode
};

async function getAllEpisodes() {
  let pos = 0;
  let elements = 20;
  let response = {
    info: {
      count: 0,
      pages: 0,
      next: "",
      prev: "",
    },
    results: [],
  };

  const episodes = await Episode.find();
  response["info"].count = episodes.length;
  response["info"].pages = Math.ceil(episodes.length / elements);
  response["info"].next = "http://localhost:3000/episodes?page=2";
  response["info"].prev = null;
  response["results"] = episodes.splice(pos, elements);

  return response;
}

async function getEpisodesbyPages(page) {
  let actualPage = parseInt(page);
  let nextPage = actualPage + 1;
  let prevPage = actualPage - 1;
  let pos = (actualPage - 1) * 20;
  let elements = 20;
  let response = {
    info: {
      count: 0,
      pages: 0,
      next: "",
      prev: "",
    },
    results: [],
  };

  const episodes = await Episode.find();
  response["info"].count = episodes.length;
  response["info"].pages = Math.ceil(episodes.length / elements);
  if (actualPage === response["info"].pages) {
    response["info"].next = null;
    response["info"].prev = `http://localhost:3000/episodes?page=${prevPage}`;
  } else if (actualPage === 1) {
    response["info"].next = `http://localhost:3000/episodes?page=${nextPage}`;
    response["info"].prev = null;
  } else if (actualPage === 2) {
    response["info"].next = `http://localhost:3000/episodes?page=${nextPage}`;
    response["info"].prev = "http://localhost:3000/episodes";
  } else {
    response["info"].next = `http://localhost:3000/episodes?page=${nextPage}`;
    response["info"].prev = `http://localhost:3000/episodes?page=${prevPage}`;
  }

  response["results"] = episodes.splice(pos, elements);
  return response;
}

async function postEpisode(episode) {
  const savedEpisode = await episode.save();
  return savedEpisode;
}

async function getSpecificEpisode(id) {
  const episode = await Episode.findOne({ id: id });

  if(isEmpty(episode)){
    return {error: "Episode not found", "status": 404};
  }

  return episode;
}

async function getMultipleEpisodes(ids) {
  let display = [];

  for (let i = 0; i < ids.length; i++) {
    const episode = await Episode.findOne({ id: ids[i] });
    display.push(episode);
  }

  return display;
}

async function updateEpisode(id, body) {
  const episode = await Episode.findOneAndUpdate(
    { id: id },
    { $set: body }
  );
  return episode;
}

async function deleteEpisode(id) {
  const episode = await Episode.findOneAndDelete({ id: id });
  return episode;
}
