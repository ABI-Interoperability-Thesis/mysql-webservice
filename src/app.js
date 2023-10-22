require('dotenv').config();
const express = require('express')
const cors = require('cors')
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('../swagger/swagger.json')
const app = express()
const port = process.env.PORT || 3002
const runtime_env = process.env.RUNTIME_ENV || 'Not specified'

const {PrepareDB} = require('./utils/sequelize')

app.use(express.json())
// Configure cors to accept traffic from all origins
const corsOptions = {
  origin: '*'
};

app.use(cors(corsOptions));

// Landing Page for the webservice
app.get('/', (req,res)=>res.send(`Interoperator Microservice | ${runtime_env}`))

//Routing /api requests to the api router
const apiRoutes = require('./routes/api-routes')
app.use('/api', apiRoutes)

//Routing /auth requests to the auth router
const authRoutes = require('./routes/auth-routes')
app.use('/auth', authRoutes)

//Routing to Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Catch unrouted requests to 404
app.use((req, res, next) => {
    const error = new Error('Route not Found')
    error.status = 404
    next(error)
  })

app.listen(port, ()=>{
    console.log(`Interoperator microservice listening in port ${port}`)
    PrepareDB()
})