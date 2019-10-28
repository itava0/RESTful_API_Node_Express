const express = require('express');
const data = require('./data/db.js')
const app = express();

//Middleware
app.use(express.json());

//Handling POST Requests
app.post('/api/users', (req, res) => {
  const user  = req.body;

  if (!user.name || !user.bio) {
    res
      .status(400)
      .json({ errorMessage: 'Please provide name and bio for the user.' });
  } else {
    data.insert(user)
      .then(user => {
        res.status(201).json({ message: 'the user was added.' });
      })
      .catch(() => {
        res.status(500).json({
          errorMessage:
            'There was an error while saving the user to the database',
        });
      });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`))