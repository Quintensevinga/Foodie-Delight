'use strict';

const Dish = require('../models/Dish');
const axios = require('axios');
const cheerio = require('cheerio');
//api from hongnhungpham130995@gmail.com
const apiKey = 'b81e42a35a164c749f93dae5d78f08b6';
// const extra_apiKey = '215c6eb9a0b54d72beee3744f74b3071';


//this is for my main page, it should be showing 3 random dishes
exports.getThreeRandomDishes = async (req, res) => {
  try {
    const numberOfRecipes = 3;
    const recipePromises = [];

    for ( let i =0; i < numberOfRecipes; i++) {
      recipePromises.push(
        axios.get(`https://api.spoonacular.com/recipes/random?apiKey=${apiKey}`)
      )
    }

    const responses = await Promise.all(recipePromises);
    const randomDishes = [];

    responses.forEach((response) => {
      const randomRecipe = response.data.recipes[0];
      const {title, image, summary, instructions} = randomRecipe;
      const $ = cheerio.load(summary);
      const plainTextSummary = $.text();
      const ins = cheerio.load(instructions);
      const plainTextInstructions = ins.text();

      randomDishes.push({
        title,
        image,
        summary: plainTextSummary,
        instructions: plainTextInstructions,
      })
    });
    res.status(200).json(randomDishes);
  } catch (err) {
    console.log('Error', err);
    res.status(500).send('Internal Server Error');
  }
}

exports.saveLikedDish = async (req, res) => {
  try {
    const dishData = req.body;

    // Check if the dish with the same data already exists
    const existingDish = await Dish.findOne(dishData);

    if (existingDish) {
      return res.status(400).json({ message: 'Dish already liked' });
    }

    // Create a new dish record with the liked status
    const newDish = new Dish({ ...dishData, liked: true });

    // Save the new liked dish to the database
    await newDish.save();

    res.status(200).json({ message: 'Dish liked and saved successfully' });

  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Internal Server Error');
  }
}



exports.getLikedDishes = async (req, res) => {
  try {
    // Find all dishes that have been liked (where liked is true)
    const likedDishes = await Dish.find({ liked: true });

    // If no liked dishes are found, you can return an empty array or an appropriate message
    if (likedDishes.length === 0) {
      return res.status(404).json({ message: 'No liked dishes found' });
    }

    // Return the liked dishes in the response
    res.status(200).json(likedDishes);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Internal Server Error');
  }
}

exports.deleteLikedDish = async (req, res) => {
  try {
    const dishId = req.params.dishId;

    // Use findByIdAndRemove to delete the dish by its _id
    const deletedDish = await Dish.findByIdAndRemove(dishId);

    if (!deletedDish) {
      return res.status(404).json({ message: 'Dish not found' });
    }

    res.status(200).json({ message: 'Dish deleted successfully' });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Internal Server Error');
  }
}