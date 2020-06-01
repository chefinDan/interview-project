// Author: Daniel Green <greendan@oregonstate.edu>

const express = require('express')

const app = express()
const port = 8080

app.use(express.static(__dirname + '/public'));

// middleware to retrieve and process city data
const getcitydata = (req, res, next) => {
  try{
    const raw = require('./data.json');
    const query = req.query
    if(query.state)
      res.data = raw.filter(d => d.State.toLowerCase() === query.state.toLowerCase());
    else
      res.data = raw;
      
    next();
  }
  catch(error){
    console.log(error);
    res.status(500).send('Server Error');
  }
}

// routes
app.get('/citydata',
  getcitydata,
  (req, res) => {
    try{
      res.status(200).send(res.data);
    }
    catch(error){
      console.log(error);
      res.status(500).send('Server Error');
    }
  }
);

app.listen(port, () => console.log(`Server listening at port:${port}`))