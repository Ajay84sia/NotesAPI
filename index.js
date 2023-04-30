const express = require('express')
const cors = require("cors")
const { connection } = require('./db')
const { userRouter } = require('./routes/User.routes')
const { auth } = require('./middleware/auth.middleware');
const { noteRouter } = require('./routes/Note.route');
require("dotenv").config()
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express()
app.use(cors())
app.use(express.json())

const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'API Documentation',
        version: '1.0.0',
      }
    },
    apis: ['./routes/*.js'], 
  };
  
  const openapiSpecification = swaggerJsdoc(options);
  app.use("/api-docs",swaggerUi.serve, swaggerUi.setup(openapiSpecification))


app.get("/", (req, res) => {
    res.status(200).send("Basic API Endpoint")
})

app.use("/users", userRouter)

app.use(auth)

app.use("/notes", noteRouter)

app.listen(process.env.port, async () => {
    try {
        await connection
        console.log("Connected to the DB")
    } catch (error) {
        console.log(error)
        console.log("Cannot connect to the DB")
    }
    console.log(`Server is running at port ${process.env.port}`)
})