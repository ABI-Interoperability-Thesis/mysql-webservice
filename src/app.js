require('dotenv').config();
const express = require('express')
const cors = require('cors')
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('../swagger/swagger.json')
const app = express()
const port = process.env.PORT || 3002

const {PrepareDB} = require('./utils/sequelize')

app.use(express.json())
// Configure cors to accept traffic from all origins
const corsOptions = {
  origin: '*'
};

app.use(cors(corsOptions));

// Landing Page for the webservice
app.get('/', (req,res)=>res.send('MySQL Webservice #2'))

//Routing /api requests to the api router
const apiRoutes = require('./routes/api-routes')
app.use('/api', apiRoutes)

//Routing to Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Catch unrouted requests to 404
app.use((req, res, next) => {
    const error = new Error('Route not Found')
    error.status = 404
    next(error)
  })

app.listen(port, ()=>{
    console.log(`MySQL webservice listening in port ${port}`)
    PrepareDB()
})