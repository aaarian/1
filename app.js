const express = require('express');
const app = express();
app.enable('trust proxy');
const {Datastore} = require('@google-cloud/datastore');
const datastore = new Datastore();

async function listCustomers() {
    const query = datastore.createQuery('Customer');
    const [entities] = await datastore.runQuery(query);
    console.log('Customers:');
    for (const entity of entities) {
      const entityKey = entity[datastore.KEY];
      console.log(entityKey.id, entity);
    }
    return datastore.runQuery(query);
  };

  app.get('/listCustomers', async (req, res, next) => {

    try {
      const [entities] = await listCustomers();
      res.json(entities)
    } catch (error) {
      next(error);
    }
  });

  app.get('/listCustomer', async (req, res, next) => {
    try {
        const [entities] = await listCustomers();
        const entity = entities.filter(entity => 
          entity[datastore.KEY].id == req.query.id);
        res.json(entity)
      } catch (error) {
        next(error);
      }
    });

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});