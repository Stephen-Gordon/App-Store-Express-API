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
        jwt.verify(token[1], process.env.JWT_SECRET, (err, decoded) => {
            if(err){
                req.user = undefined;
            }
            req.user = decoded;
            next();
        });
    }
    else {
        console.log("No token");
        req.user = undefined;  //<------ this line
    }
    next(); //<------ this line
});
///


app.use('/api/users', require('./routes/users'));
app.use('/api/apps', require('./routes/apps'));
app.use('/api/reviews', require('./routes/reviews'));



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});