const Recipe = require("../models/Recipe");

module.exports = {
    Query: {
        async recipe(parent, { id }) {
            return await Recipe.findById(id)
        },
        async getRecipes(_, { amount }) {
            return await Recipe.find().sort({ createdAt: -1 }).limit(amount)
        }
    },
    Mutation: {
        async createRecipe(parent, { recipeInput: { name, description } }) {
            const recipe = new Recipe({
                name: name,
                description: description,
                createdAt: new Date().toISOString(),
                thumbsUp: 0,
                thumbsDown: 0,
            });
            const res = await recipe.save()
            return {
                id: res.id,
                ...res._doc
            };
        },
        async deleteRecipe(parent, { id }) {
            const isDelete = await Recipe.findByIdAndRemove(id);
            return !!isDelete;
        },
        async editRecipe(parent, { id, recipeInput }) {
            const isUpdate = await Recipe.findByIdAndUpdate(
                id,
                {
                    $set: {
                        name: recipeInput.name,
                        description: recipeInput.description,
                    },
                },
                { new: true }
            );
            return isUpdate;
        },
    }
}