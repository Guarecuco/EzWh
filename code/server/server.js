'use strict';

const userRouter = require('./routesModule/UserRoutes.js')
const skuRouter = require('./routesModule/SkuRoutes.js')
const positionRouter = require('./routesModule/PositionRoutes.js')
const restockOrderRouter = require('./routesModule/RestockOrderRoutes.js')
const returnOrderRouter = require('./routesModule/ReturnOrderRoutes.js')
const internalOrderRouter = require('./routesModule/InternalOrderRoutes.js')
const skuitemRouter = require('./routesModule/SkuitemRoutes.js')
//const testDescriptorRouter = require('./routesModule/TestDescriptorRoutes.js')
//const testResultRouter = require('./routesModule/TestResultRoutes.js')

const express = require('express');
// init express
const app = new express();
app.use(userRouter)
app.use(skuRouter)
app.use(positionRouter)
app.use(restockOrderRouter)
app.use(returnOrderRouter)
app.use(internalOrderRouter)
app.use(skuitemRouter)
//app.use(testDescriptorRouter)
//app.use(testResultRouter)

const port = 3001;

app.use(express.json());

//GET /api/test
app.get('/api/hello', (req,res)=>{
  let message = {
    message: 'Hello World!'
  }
  return res.status(200).json(message);
});


// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

module.exports = app;
