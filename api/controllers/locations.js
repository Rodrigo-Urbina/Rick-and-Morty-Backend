const Location = require("../models/locations");

module.exports = {
  getAllLocations,
  getLocationsbyPages,
  postLocation,
  getSpecificLocation,
  getMultipleLocations,
  updateLocation,
  deleteLocation,
};

async function getAllLocations() {
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

  const locations = await Location.find();
  response["info"].count = locations.length;
  response["info"].pages = Math.ceil(locations.length / elements);
  response["info"].next = "http://localhost:3000/locations?page=2";
  response["info"].prev = null;
  response["results"] = locations.splice(pos, elements);

  return response;
}

async function getLocationsbyPages(page) {
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

  const locations = await Location.find();
  response["info"].count = locations.length;
  response["info"].pages = Math.ceil(locations.length / elements);
  if (actualPage === response["info"].pages) {
    response["info"].next = null;
    response["info"].prev = `http://localhost:3000/locations?page=${prevPage}`;
  } else if (actualPage === 1) {
    response["info"].next = `http://localhost:3000/locations?page=${nextPage}`;
    response["info"].prev = null;
  } else if (actualPage === 2) {
    response["info"].next = `http://localhost:3000/locations?page=${nextPage}`;
    response["info"].prev = "http://localhost:3000/locations";
  } else {
    response["info"].next = `http://localhost:3000/locations?page=${nextPage}`;
    response["info"].prev = `http://localhost:3000/locations?page=${prevPage}`;
  }

  response["results"] = locations.splice(pos, elements);
  return response;
}

async function postLocation(location) {
  const savedLocation = await location.save();
  return savedLocation;
}

async function getSpecificLocation(id) {
  const location = await Location.findOne({ id: id });
  return location;
}

async function getMultipleLocations(ids) {
  let display = [];

  for (let i = 0; i < ids.length; i++) {
    const location = await Location.findOne({ id: ids[i] });
    display.push(location);
  }

  return display;
}

async function updateLocation(id, body) {
  const location = await Location.findOneAndUpdate({ id: id }, { $set: body });
  return location;
}

async function deleteLocation(id) {
  const location = await Location.findOneAndDelete({ id: id });
  return location;
}
