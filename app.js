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

const getCustomerByID = (custId) => {
  const cust = parseInt(custId);
  //const key = datastore.key(['Customer', cust]);   
  const query = datastore
    .createQuery('Customer')
    .filter('customerID', '=', cust);
  //  .filter('__key__', key);

  
  return datastore.runQuery(query);
};

  app.get('/getCustomers', async (req, res, next) => {

    try {
      const [entities] = await getCustomers();
      res.json(entities)
    } catch (error) {
      next(error);
    }
  });
 
  app.get('/getCustomer', async (req, res, next) => {
    const custId = req.query.id;

    if (custId === ''){
    try {
        const [entities] = await getCustomers();
        const entityKeys = entities.map(entity => entity.customerID);
        res.json({id: entityKeys})
      } catch (error) {
        next(error);
      }
    }
    else {
      try {
        const [entities] = await getCustomerByID(custId);
          res.json(entities[0])
      } catch (error) {
        next(error);
      }
      }
    });

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});