import * as express from 'express'
import { ObjectId } from 'mongodb'
import { collections } from '../config/database'
import { Recipe } from '../models/recipe.model'

export const recipeRouter = express.Router()
recipeRouter.use(express.json())

recipeRouter.get('/', async (_req, res) => {
	try {
		const recipes = await collections?.recipes?.find({}).toArray()
		res.status(200).send(recipes)
	} catch (error) {
		res
			.status(500)
			.send(error instanceof Error ? error.message : 'Unknown error')
	}
})

recipeRouter.get('/:id', async (req, res) => {
	try {
		const id = req?.params?.id
		if (!ObjectId.isValid(id)) {
			res.status(400).send('Invalid recipe ID format')
		}
		const query = { _id: new ObjectId(id) }
		const recipe = await collections?.recipes?.findOne(query)

		if (recipe) {
			res.status(200).send(recipe)
		} else {
			res.status(404).send(`Failed to find an recipe: ID ${id}`)
		}
	} catch (error) {
		res.status(404).send(`Failed to find an recipe: ID ${req?.params?.id}`)
	}
})

recipeRouter.post('/', async (req, res) => {
	try {
		const recipe = req.body
		const hardcodedUserId = '64df68b9ca509d1bf885d51f'
		const userId = new ObjectId(hardcodedUserId)
		const newRecipeData: Recipe = { ...recipe, user: userId! }

		const result = await collections?.recipes?.insertOne(newRecipeData)

		if (result?.acknowledged) {
			res.status(201).send(`Created a new recipe: ID ${result.insertedId}.`)
		} else {
			res.status(500).send('Failed to create a new recipe.')
		}
	} catch (error) {
		console.error(error)
		res
			.status(400)
			.send(error instanceof Error ? error.message : 'Unknown error')
	}
})

recipeRouter.put('/:id', async (req, res) => {
	try {
		const id = req?.params?.id
		if (!ObjectId.isValid(id)) {
			res.status(400).send('Invalid recipe ID format')
		}
		const recipe = req.body
		const query = { _id: new ObjectId(id) }
		const result = await collections?.recipes?.updateOne(query, {
			$set: recipe,
		})

		if (result && result.matchedCount) {
			res.status(200).send(`Updated an recipe: ID ${id}.`)
		} else if (!result?.matchedCount) {
			res.status(404).send(`Failed to find an recipe: ID ${id}`)
		} else {
			res.status(304).send(`Failed to update an recipe: ID ${id}`)
		}
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Unknown error'
		console.error(message)
		res.status(400).send(message)
	}
})

recipeRouter.delete('/:id', async (req, res) => {
	try {
		const id = req?.params?.id
		const query = { _id: new ObjectId(id) }
		const result = await collections?.recipes?.deleteOne(query)

		if (result && result.deletedCount) {
			res.status(202).send(`Removed an recipe: ID ${id}`)
		} else if (!result) {
			res.status(400).send(`Failed to remove an recipe: ID ${id}`)
		} else if (!result.deletedCount) {
			res.status(404).send(`Failed to find an recipe: ID ${id}`)
		}
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Unknown error'
		console.error(message)
		res.status(400).send(message)
	}
})
