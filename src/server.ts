import * as dotenv from 'dotenv'
import express from 'express'
import cors, { CorsOptions } from 'cors'
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
		const allowedOrigins = [
			'https://frontend-3l8g70u1e-semmyks-projects.vercel.app',
			'https://frontend-omega-nine-87.vercel.app',
			'http://localhost:4200',
		]

		const corsOptions: CorsOptions = {
			origin: (origin, callback) => {
				if (!origin) return callback(null, true)
				if (allowedOrigins.includes(origin)) {
					callback(null, true)
				} else {
					callback(new Error('Not allowed by CORS'))
				}
			},
			credentials: true,
		}

		app.use(cors(corsOptions))

		app.use(express.json())
		app.use('/api/recipes', recipeRouter)
		app.get('/api/recipes', (req, res) => {
			res.json({ message: 'This is your API response' })
		})
		app.listen(PORT, () => {
			console.log(`Server running at http://localhost:${PORT}...`)
		})
	})
	.catch(error => console.error(error))
