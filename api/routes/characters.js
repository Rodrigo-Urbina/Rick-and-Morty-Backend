const express = require('express');
const router = express.Router();
const Character = require("../models/characters");
const Controller = require("../controllers/characters");
const checkAuth = require('../middleware/check-auth');

// Get all Characters and add pagination
router.get('/', checkAuth, async(req, res) => {
    let characters;
    if(req.query.page) {
        if(req.query.pageSize){
            characters = await Controller.getCharactersbyPages(req.query.page, req.query.pageSize);
        }
        else{
            characters = await Controller.getCharactersbyPages(req.query.page);
        }
        
    } else {
        if(req.query.pageSize){
            characters = await Controller.getCharactersbyPages(1, req.query.pageSize);            
        }
        else {
            characters = await Controller.getAllCharacters();
        }
    }

    if(isEmpty(characters.results)){
        return res.status(400).json({error: "Bad request", "status": 400});
    }
    res.json(characters);
});

// Create a new Character
router.post('/', checkAuth, async(req, res) => {
    const character = new Character(req.body);
    const savedCharacter = await Controller.postCharacter(character);
    res.json(savedCharacter);
});

// Get a specific Character or multiple Characters
router.get("/:id", checkAuth, async(req, res) => {
    let result;
    if((req.params.id).search(",")>0) {
        const arr = (req.params.id).split`,`.map(x => +x);

        if(arr.includes(NaN)){
            return res.status(400).json({error: "Bad request", "status": 400});
        }
        
        result = await Controller.getMultipleCharacters(arr);
    } else {
        console.log(req.params.id)
        if(isNaN(parseInt(req.params.id))){
            return res.status(400).json({error: "Bad request", "status": 400});
        }
        result = await Controller.getSpecificCharacter(req.params.id);
    }

    res.json(result);
});

// Update a Character
router.patch('/:id', checkAuth, async(req, res) => {
    const character = await Controller.updateCharacter(req.params.id, req.body);
    res.json(character);
})

// Delete a Character
router.delete('/:id', checkAuth, async(req, res) => {
    const character = await Controller.deleteCharacter(req.params.id);
    res.json(character);
})

module.exports = router;






function isEmpty(obj){
    if (obj == null) return true;
 
    if (obj.length && obj.length > 0)    return false;
    if (obj.length === 0)  return true;

    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }
 
    return true;
}