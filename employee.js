const express = require('express');
const app = express();
const {Datastore} = require('@google-cloud/datastore');
const datastore = new Datastore();

const addUser = user => {	 
    return datastore.save({
      key: datastore.key('users'),
      data: user,
    });
  };

const getUser = () => {
    const query = datastore
      .createQuery('users')
    return datastore.runQuery(query);
  };  

const getUserByName = (name) => {
  const query = datastore
    .createQuery('users')
    .filter('name','=',name)
  return datastore.runQuery(query);
};

app.use('/view',express.static('static-echart'))

app.get('/', (req, res) => {
  res.send('Hello from App Engine!');
});

app.get('/adduser/:name', async (req, res, next) => {
    const user = {
        name: req.params.name,
        age: parseInt(req.query.age),
        sen: parseInt(req.query.sen)  
    };
    try {
      await addUser(user);
      res.send(`User ${req.params.name} added`);
    } catch (error) {
      next(error);
    }
});

app.get('/getuser', async (req, res, next) => {
    try {
        const [entities] = await getUser();
        users = JSON.stringify(entities);
        res.send(`${users}`);
      } catch (error) {
        next(error);
      }
});

app.get('/getUserByName/:name', async (req,res,next) => {
  try {
    const [entities] = await getUserByName(req.params.name);
    users = JSON.stringify(entities);
    res.send(`${users}`)
  } catch (error) {
    next(error)
  }
})

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
