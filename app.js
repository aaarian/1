const express = require('express');
const app = express();
app.enable('trust proxy');
const {Datastore} = require('@google-cloud/datastore');
const datastore = new Datastore();

const getCustomers = () => {
  const query = datastore
    .createQuery('Customer')
    .order('lastName', {descending: true})
    .limit(10);

  return datastore.runQuery(query);
};

  app.get('/Customers', async (req, res, next) => {
    try {
      const [entities] = await getCustomers();
      const customers = entities.map(
        entity => 
        `Id: ${entity[datastore.KEY].id}, 
        First name: ${entity.firstName}, 
        Last name: ${entity.lastName},
        Social security number: ${entity.ssn}`
      );
      res
        .status(200)
        .set('Content-Type', 'text/plain')
        .send(`Last 10 customers:\n${customers.join('\n')}`)
        .end();
    } catch (error) {
      next(error);
    }
  });

  app.get('/Customer', async (req, res, next) => {
try {
      const [entities] = await getCustomers();
      const customer = entities
        .filter(entity => 
        entity[datastore.KEY].id == req.query.id)  
        .map(
        entity => 
        `Id: ${entity[datastore.KEY].id}, 
        First name: ${entity.firstName}, 
        Last name: ${entity.lastName},
        Social security number: ${entity.ssn}`
      );
      res
        .status(200)
        .set('Content-Type', 'text/plain')
        .send(`Customer:\n${customer}`)
        .end();
    } catch (error) {
      next(error);
    }
  });

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});