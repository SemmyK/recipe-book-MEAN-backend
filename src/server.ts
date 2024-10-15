import * as dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import { connectToDatabase } from '../config/database'
import { recipeRouter } from '../routes/recipe.routes'

dotenv.config()

const { ATLAS_URI } = process.env
const PORT = process.env.PORT || 5200

if (!ATLAS_URI) {
	console.error(
		'No ATLAS_URI environment variable has been defined in config.env'
	)
	process.exit(1)
}

connectToDatabase(ATLAS_URI)
	.then(() => {
		const app = express()
		app.use(cors())
		app.use(
			cors({
				origin: '*',
			})
		)
		app.use(express.json())
		app.use('/api/recipes', recipeRouter)

		app.listen(PORT, () => {
			console.log(`Server running at http://localhost:${PORT}...`)
		})
	})
	.catch(error => console.error(error))
