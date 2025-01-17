import app from "./app";

/* const {PORT = 4000} = process.env; */

const PORT = process.env.PORT || 4000;

app.listen(PORT,()=>{
    console.log(`Listening port ${PORT}`)
})