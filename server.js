const express = require('express');
const app = express();
const port = 3000;

require('dotenv').config();
require('./configs/db.js')();

app.use(express.json());
app.set('view engine', 'html');

app.use(express.static(__dirname + '/views/'));

//custom middleware
app.use((req, res, next) => {

    console.log(req.headers);
    let token = null;

    if(req.headers.authorization){
        token = req.headers.authorization.split(' ');
    }

    console.log(token);

    if(token && token[0] === 'Bearer'){
        // verify token is valid
    }
    else {
        console.log("No token");
    }

    next();
});
///


app.use('/api/users', require('./routes/users'));
app.use('/api/apps', require('./routes/apps'));



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});