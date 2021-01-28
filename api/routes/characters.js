const express = require('express');
const router = express.Router();
const Character = require("../models/characters");
const Controller = require("../controllers/characters");

// Get all Characters and add pagination
router.get('/', async(req, res) => {
    let characters;
    if(req.query.page) {
        characters = await Controller.getCharactersbyPages(req.query.page);
    } else {
        characters = await Controller.getAllCharacters();
    }

    res.json(characters);
});

// Create a new Character
router.post('/', async(req, res) => {
    const character = new Character(req.body);
    const savedCharacter = await Controller.postCharacter(character);
    res.json(savedCharacter);
});

// Get a specific Character or multiple Characters
router.get("/:id", async(req, res) => {
    let result;
    if((req.params.id).search(",")) {
        const arr = (req.params.id).split`,`.map(x => +x);
        result = await Controller.getMultipleCharacters(arr);
    } else {
        result = await Controller.getSpecificCharacter(req.params.id);
    }

    res.json(result);
});

// Update a Character
router.patch('/:id', async(req, res) => {
    const character = await Controller.updateCharacter(req.params.id, req.body);
    res.json(character);
})

// Delete a Character
router.delete('/:id', async(req, res) => {
    const character = await Controller.deleteCharacter(req.params.id);
    res.json(character);
})

module.exports = router;