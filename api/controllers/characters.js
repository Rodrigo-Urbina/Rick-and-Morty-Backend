const Character = require("../models/characters");
const isEmpty = require('../middleware/isEmpty');

module.exports = {
  getAllCharacters,
  getCharactersbyPages,
  postCharacter,
  getSpecificCharacter,
  getMultipleCharacters,
  updateCharacter,
  deleteCharacter,
};

async function getAllCharacters() {
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

  const characters = await Character.find();
  response["info"].count = characters.length;
  response["info"].pages = Math.ceil(characters.length / elements);
  response["info"].next = "http://localhost:3000/characters?page=2";
  response["info"].prev = null;
  response["results"] = characters.splice(pos, elements);

  return response;
}

async function getCharactersbyPages(page, pageSize) {
  let actualPage = parseInt(page);
  let nextPage = actualPage + 1;
  let prevPage = actualPage - 1;
  let elements = parseInt(pageSize) || 20;
  let pos = (actualPage - 1) * elements;
  let response = {
    info: {
      count: 0,
      pages: 0,
      pageSize: 0,
      next: "",
      prev: "",
    },
    results: [],
  };

  const characters = await Character.find();
  response["info"].count = characters.length;
  response["info"].pages = Math.ceil(characters.length / elements);
  response["info"].pageSize = elements;
  if (actualPage === response["info"].pages) {
    response["info"].next = null;
    response["info"].prev = `http://localhost:3000/characters?page=${prevPage}`;
  } else if (actualPage === 1) {
    response["info"].next = `http://localhost:3000/characters?page=${nextPage}`;
    response["info"].prev = null;
  } else if (actualPage === 2) {
    response["info"].next = `http://localhost:3000/characters?page=${nextPage}`;
    response["info"].prev = "http://localhost:3000/characters";
  } else {
    response["info"].next = `http://localhost:3000/characters?page=${nextPage}`;
    response["info"].prev = `http://localhost:3000/characters?page=${prevPage}`;
  }

  response["results"] = characters.splice(pos, elements);
  return response;
}

async function postCharacter(character) {
  const savedCharacter = await character.save();
  return savedCharacter;
}

async function getSpecificCharacter(id) {
  console.log('enters specific')
  const character = await Character.findOne({ id: id });
  console.log(character);
  if(isEmpty(character)|| character==null){
    return {error: "Character not found", "status": 404};
  }
  return character;
}

async function getMultipleCharacters(ids) {
  let display = [];

  for (let i = 0; i < ids.length; i++) {
    const character = await Character.findOne({ id: ids[i] });
    display.push(character);
  }

  return display;
}

async function updateCharacter(id, body) {
  const character = await Character.findOneAndUpdate(
    { id: id },
    { $set: body }
  );
  return character;
}

async function deleteCharacter(id) {
  const character = await Character.findOneAndDelete({ id: id });
  return character;
}

