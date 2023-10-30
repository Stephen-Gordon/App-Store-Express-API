const App = require('../models/app.model')


const readData = (req, res) => {


    App.find({})
    .then((data) => {
        

        data ? res.status(200).json(data) 
        :
        res.status(404).json('none found') 
    })
    .catch(err => {
        console.error(`Error ${err}`)
        res.status(500).json(err)
    })


};

const readOne = (req, res) => {
    
    let id = req.params.id;



    App.findById(id)        
    .then(data => {
        !data ? res.status(404).json({msg: `app ${id} not found`}) 
        :
         res.status(200).json(data)
    })
    .catch(err => {
        //Check for cast Error
        err.name == 'CastError'
        ? res.status(404).json({msg: `App ${id} not found`})
        : res.status(500).json(err)

        console.error(`Error ${err}`)
       
    })

    
};


const createData = (req, res) => {
    
   inputData = req.body;

   App.create(inputData)
   .then(data => {
        console.log(`New Fesival created`, data)
        res.status(201).json(data)
   })
   .catch(err => {
    console.log(err)
    err.name == "ValidationError"  ? res.status(422).json.error : res.status(500).json
    
    
   })
   

};


const updateData = (req, res) => {
    
    let id = req.params.id;

    let data = req.body;

    App.findByIdAndUpdate(id, data, {
        new: true
    })
    .then(newData => {
        res.status(201).json({
            msg: `You Updated App ${id}`,
            data: newData
        })
    })
    .catch(err => {
         //Check for cast Error
         err.name == 'CastError'
         ? res.status(404).json({msg: `App ${id} not found`})
         : res.status(500).json(err)
 
         console.error(`Error ${err}`)
    })




};


const deleteData = (req, res) => {
    
    let id = req.params.id;

    App.findByIdAndDelete(id)
    .then(newData => {

        !newData ? res.status(404).json({msg: `App ${id} not found`}) 
        :
        res.status(200).json({
            msg: `You deleted App ${id}`,
            data: newData
        })
    })
    .catch(err => {
         //Check for cast Error
         err.name == 'CastError'
         ? res.status(404).json({msg: `App ${id} not found`})
         : res.status(500).json(err)
 
         console.error(`Error ${err}`)
    })

    
};

module.exports ={
    readData,
    readOne,
    createData,
    updateData,
    deleteData
};