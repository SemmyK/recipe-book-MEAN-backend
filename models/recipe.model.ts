import * as mongodb from 'mongodb'

export interface Recipe {
	title: string
	cookingTime: string
	method: string
	user: mongodb.ObjectId
	recipeType:
		| 'meal'
		| 'soup'
		| 'salad'
		| 'smoothie'
		| 'snack'
		| 'sauce'
		| 'side'
		| 'dessert'
	ingredients: string[]
	_id?: mongodb.ObjectId
	createdAt: Date
	updatedAt: Date
}

export interface User {
	_id?: mongodb.ObjectId
}
