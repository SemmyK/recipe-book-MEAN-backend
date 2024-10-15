import * as mongodb from 'mongodb'
import { Recipe } from '../models/recipe.model'

export const collections: {
	recipes?: mongodb.Collection<Recipe>
} = {}

export async function connectToDatabase(uri: string) {
	const client = new mongodb.MongoClient(uri)
	await client.connect()

	const db = client.db('recipe-book')
	await applySchemaValidation(db)

	const employeesCollection = db.collection<Recipe>('recipes')
	collections.recipes = employeesCollection
}

// Update our existing collection with JSON schema validation so we know our documents will always match the shape of our Employee model, even if added elsewhere.
// For more information about schema validation, see this blog series: https://www.mongodb.com/blog/post/json-schema-validation--locking-down-your-model-the-smart-way
async function applySchemaValidation(db: mongodb.Db) {
	const jsonSchema = {
		$jsonSchema: {
			bsonType: 'object',
			required: ['title', 'cookingTime', 'method', 'type', 'ingredients'],
			additionalProperties: true,
			properties: {
				_id: {},
				user: mongodb.ObjectId,
				title: {
					bsonType: 'string',
					description: 'Please add title',
					minLength: 5,
				},
				cookingTime: {
					bsonType: 'string',
					description: 'Please add cooking time',
				},
				method: {
					bsonType: 'string',
					description: 'Please add cooking method',
				},
				ingredients: {
					bsonType: ['array'],
					minItems: 1,
					maxItems: 50,
					items: {
						bsonType: 'string',
					},
					description: 'Please add ingredients',
				},
				type: {
					bsonType: 'string',
					description: 'Please select a type for a recipe.',
					enum: [
						'meal',
						'soup',
						'salad',
						'smoothie',
						'snack',
						'sauce',
						'side',
						'dessert',
					],
					default: 'meal',
				},
				createdAt: {
					bsonType: 'date',
					description: 'Timestamp when the recipe was created',
				},
				updatedAt: {
					bsonType: 'date',
					description: 'Timestamp when the recipe was last updated',
				},
			},
		},
	}

	await db
		.command({
			collMod: 'recipes',
			validator: jsonSchema,
		})
		.catch(async (error: mongodb.MongoServerError) => {
			if (error.codeName === 'NamespaceNotFound') {
				await db.createCollection('recipes', { validator: jsonSchema })
			}
		})
}
