import express from 'express'
import homeController from '../Controllers/homecontroller'

const apiRouter = express.Router()

apiRouter.get("/",homeController)




export default apiRouter