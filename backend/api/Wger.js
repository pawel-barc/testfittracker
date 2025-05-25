const axios = require("axios");
const ExerciseCategory = require("../models/ExerciseCategory");
const TypeExercise = require("../models/TypeExercise");
const getAndAddCategoriesFromWger = async () => {
  try {
    const response = await axios.get(
      "https://wger.de/api/v2/exercisecategory/",
      {
        params: {
          language: 4,
        },
      }
    );
    const categories = response.data.results;
    for (let category of categories) {
      const existingCategory = await ExerciseCategory.findOne({
        where: { name: category.name },
      });
      if (!existingCategory) {
        await ExerciseCategory.create({
          name: category.name,
        });
        console.log(`La catégorie ${category.name} a été ajoutée.`);
      } else {
        console.log(`La catégorie ${category.name} existe déjà.`);
      }
    }
    return { message: "Les categories ont été ajoutée à la base des données" };
  } catch (err) {
    console.error(
      "Une erreur est survenue lors de la récupération des catégories",
      err
    );
    return { error: "Une erreur est survenue", message: err.message };
  }
};

const getAndAddExercisesFromWger = async () => {
  try {
    const response = await axios.get("https://wger.de/api/v2/exerciseinfo/", {
      params: {
        language: 12,
        limit: 100,
      },
    });
    const exercises = response.data.results;
    for (const exercise of exercises) {
      const translation = exercise.translations.find((t) => t.language === 12);
      const categoryId =
        typeof exercise.category === "object"
          ? exercise.category.id
          : exercise.category;
      if (!translation || !translation.name || !categoryId) {
        console.log(` L'exercise ${exercise.id} - non pris en compte`);
        continue;
      }
      const existingExercise = await TypeExercise.findOne({
        where: { name: translation.name },
      });
      if (existingExercise) {
        console.log(`L'exercise ${translation.name} existe déjà`);
        continue;
      }
      console.log(
        ` L'exercise ${exercise.id} - ${translation.name}  a été ajoutée au liste `
      );

      await TypeExercise.create({
        name: translation.name,
        description: translation.description || "Pas de description",
        calories_burned_per_min: 5,
        exercise_category_id: categoryId,
      });
    }
    console.log("Les exercises ont été récupérées");
    return { message: "Les exercises ont été ajoutées à la base de données" };
  } catch (err) {
    console.error({
      error: "Une erreur est survenue lors de la récupération des données",
      message: err.message,
    });
    return { error: "Echeque", message: err.message };
  }
};

module.exports = { getAndAddCategoriesFromWger, getAndAddExercisesFromWger };
