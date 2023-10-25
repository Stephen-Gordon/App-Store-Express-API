const App = require('../models/app.model');

const readData = (req, res) => {

    App.find({})
    .then((data) => {
        console.log(data);

        if(data.length > 0){
            res.status(200).json(data);
        }
        else{
            res.status(404).json('No apps found');
        }
    })
    .catch(err => {
        console.error(err);
        res.status(500).json(err);
    });
};

const readOne = (req, res) => {

    let id = req.params.id;
    
    App.findById(id)
    .then(data => {

        if(!data){
            res.status(404).json({ msg: `App ${id} not found!`});
        }
            
        res.status(200).json(data);
        
    })
    .catch(err => {
        if(err.name === 'CastError'){
            res.status(404).json({ msg: `App ${id} not found!`});
        }
        else{
            console.error(err);
            res.status(500).json(err);
        }  
    });

};

const createData = (req, res) => {

    console.log(req.body);
    let inputData = req.body;

    App.create(inputData)
    .then(data => {
        console.log(`New App Created`, data);
        res.status(201).json(data);
    })
    .catch(err => {
        if(err.name === 'ValidationError'){
            res.status(422).json(err);
        }
        else {
            console.error(err);
            res.status(500).json(err);
        }
    });
};

const updateData = (req, res) => {

    let id = req.params.id;
    let data = req.body;

    App.findByIdAndUpdate(id, data, {
        new: true,
    })
    .then(newData => {
        res.status(201).json(newData);
    })
    .catch(err => {
        if(err.name === 'ValidationError'){
            res.status(422).json(err);
        }
        else if(err.name === 'CastError'){
            res.status(404).json({ msg: `App ${id} not found!`});
        }
        else {
            console.error(err);
            res.status(500).json(err);
        }
    });

};

const deleteData = (req, res) => {

    let id = req.params.id;

    App.findByIdAndDelete(id)
    .then(data => {

        if(!data){
            res.status(404).json({ msg: `App ${id} not found!`});
        }

        res.status(200).json({msg: `App ${id} deleted!`});
    })
    .catch(err => {
        if(err.name === 'CastError'){
            res.status(404).json({ msg: `App ${id} not found!`});
        }
        else {
            console.error(err);
            res.status(500).json(err);
        }
    });
};

module.exports = {
    readData,
    readOne,
    createData,
    updateData,
    deleteData
};