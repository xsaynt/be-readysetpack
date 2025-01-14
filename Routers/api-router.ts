import express from 'express'

const apiRouter = express.Router()

apiRouter.get("/",(req,res,next)=>{
    res.send("Hello from test endpoint")
})




export default apiRouter