require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Food = require("./model/Food");

const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect(MONGO_URL).then(() => console.log("DB Connected"));

// create food - POST

app.post("/", async (req, res) => {
  const foodName = req.body.foodName;
  const daysSinceEaten = req.body.daysSinceEaten;

  const newFood = new Food({
    foodName: foodName,
    daysSinceEaten: daysSinceEaten,
  });

  try {
    await newFood.save();
    res.status(200).json({ msg: "Saved" });
  } catch (error) {
    console.log(error);
  }
});

// Read the data from DB - GET

app.get("/display", async (req, res) => {
  try {
    const foods = await Food.find({});
    res.status(200).json(foods);
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Error retrieving data", error: error.message });
  }
});

// UPDATE the data - PUT

app.put("/update/:id", async (req, res) => {
  const id = req.params.id;
  const newFoodName = req.body.newFoodName; // Correct variable naming

  try {
    const foodToUpdate = await Food.findById(id);
    if (!foodToUpdate) {
      return res.status(404).send({ msg: "Food ID not found" }); // Return after sending response
    }
    foodToUpdate.foodName = newFoodName;
    await foodToUpdate.save();
    res.status(200).send({ msg: "Updated", newFoodName });
  } catch (error) {
    console.log("Update error:", error); // More detailed logging
    res.status(500).json({ msg: "Not updated", error: error.message }); // Correct status code
  }
});



// Delete the data - DELETE

app.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedFood = await Food.findByIdAndDelete(id);

    if (!deletedFood) {
      return res.status(404).json({ msg: "Food not found" });
    }

    res.status(200).json({ msg: "Food deleted", deletedFood });
  } catch (error) {
    res.status(500).json({ msg: "Error deleting food", error: error.message });
  }
});

app.listen(PORT, () =>
  console.log(`Server running on port 'http://localhost:${PORT}'`)
);
