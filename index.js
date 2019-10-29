const express = require('express');
const data = require('./data/db.js')
const cors = require('cors')
const app = express();

//Middleware
app.use(express.json());
app.use(cors())

//Handling POST Requests
app.post('/api/users', (req, res) => {
  const user  = req.body;
  //If the request body is missing the name or bio property
  if (!user.name || !user.bio) {
    res.status(400).json({ errorMessage: 'Please provide name and bio for the user.' });
  } else {
    //If the information about the user is valid
    //save the new user the the database.
   //return HTTP status code 201 (Created).
    data.insert(user)
      .then(user => {
        res.status(201).json({ message: 'the user was added.' });
      })
      .catch(() => {
        //If there's an error while saving the user
        //cancel the request.
        //respond with HTTP status code 500 (Server Error)
        res.status(500).json({
          errorMessage:
            'There was an error while saving the user to the database',
        });
      });
  }
});

//Handling GET Requests
app.get('/api/users', (req, res) => {
  //find returns a promise that resolves to an array of all the users contained in the database
  data.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(() => {
      res.status(500).json({
        errorMessage: 'The users information could not be retrieved.',
      });
    });
});

app.get('/api/users/:id', (req, res) => {
  //findById returns the user corresponding to the id provided or an empty array if no user with that id is found
  data.findById(req.params.id)
    .then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
        res
          .status(404)
          .json({ message: 'The user with the specified ID does not exist.' });
      }
    })
    .catch(() => {
      res
        .status(500)
        .json({ errorMessage: 'The user information could not be retrieved.' });
    });
});

//Handling Delete Requests
app.delete('/api/users/:id', (req, res) => {
  data.remove(req.params.id)
  .then(user => {
    if (user) {
      res.status(200).json({ message: 'the user was deleted.' });
    } else {
      res
        .status(404)
        .json({ message: 'The user with the specified ID does not exist.' });
    }
  })
  .catch(() => {
    res
      .status(500)
      .json({ errorMessage:  "The user could not be removed." });
  });
});

//Handling PUT Requests
app.put('/api/users/:id', (req, res) => {
  const user = req.body;
  
  if (!user.name || !user.bio) {
    res
      .status(400)
      .json({ errorMessage: 'Please provide name and bio for the user.' });
  } else {
    data.update(req.params.id, req.body)
      .then(user => {
        if (user) {
          res.status(200).json(user);
        } else {
          res
            .status(404)
            .json({
              message: 'The user with the specified ID does not exist.',
            });
        }
      })
      .catch(() => {
        res.status(500).json({
          errorMessage: 'The user information could not be modified.',
        });
      });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`))