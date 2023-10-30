const Review = require('../models/review.model')
const App = require('../models/app.model')

const readData = (req, res) => {


    Review.find({})
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

/* const createData = (req, res) => {
    
    inputData = req.body;
 
    Review.create(inputData)
    .then(data => {
         console.log(`New Review created`, data)
         res.status(201).json(data)
    })
    .catch(err => {
     console.log(err)
     err.name == "ValidationError"  ? res.status(422).json.error : res.status(500).json
     
     
    })
    
 
 }; */

 const createData = (req, res) => {
    const inputData = req.body;
  
    // Assuming 'appId' is part of the review input data or can be determined based on the context.
    const appId = req.body.app; // Replace with the actual app ObjectId.
  
    inputData.app = appId; // Add the 'app' field to the review with the app's ObjectId.
  
    Review.create(inputData)
      .then((review) => {
        console.log(`New Review created`, review);
        // Now, update the app's 'reviews' array to include the review's ObjectId.
        return App.findByIdAndUpdate(appId, { $push: { reviews: review._id } }, { new: true });
      })
      .then((updatedApp) => {
        res.status(201).json(updatedApp);
      })
      .catch((err) => {
        console.log(err);
        if (err.name === 'ValidationError') {
          res.status(422).json(err);
        } else {
          res.status(500).json(err);
        }
      });
  };
  

module.exports ={
    readData,
    createData
};