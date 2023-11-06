const Review = require('../models/review.model')
const App = require('../models/app.model')
const User = require('../models/user.model')
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

 //https://www.mongodb.com/docs/manual/reference/operator/update/push/
const createData = async (req, res) => {
    try {

        const inputData = req.body;
        const appId = req.body.app;
        const userId = req.body.user;

        // create a new review
        const review = await Review.create(inputData);

        //create a reference to the review in the user and app collections
        //use $push operator to add to an array
        await User.findByIdAndUpdate(userId, { $push: { reviews: review._id } }, { new: true });
        await App.findByIdAndUpdate(appId, { $push: { reviews: review._id } }, { new: true });
        
        res.status(201).json(review);
    } catch (err) {
        console.error(err);
        if (err.name === 'ValidationError') {
            res.status(422).json(err);
        } else {
            res.status(500).json(err);
        }
    }
};

const deleteData = async (req, res) => {
  try {
    const id = req.params.id;

    // delete review from reviews collection
    const deleteReview = await Review.findByIdAndDelete(id);

    // check if review exists
    !deleteReview ? res.status(404).json({ msg: `Review ${id} not found` }) :

    // remove review reference from App and User collections
    // https://stackoverflow.com/questions/54992810/update-many-in-mongoose
    // updateMany(filter, update, options)
    // filter must be an object
    await App.updateMany({reviews: id}, { $pull: { reviews: id } }, { new: true });
    await User.updateMany({reviews: id} , { $pull: { reviews: id } }, { new: true });

    // return 200 if its deleted
    res.status(200).json({
      msg: `You deleted Review ${id}`
    });

  } catch (err) {
    //handle error
    if (err.name === 'CastError') {
      res.status(404).json({ msg: `Review ${id} not found` });
    } else {
      res.status(500).json(err);
    }
    console.error(`Error ${err}`);
  }
};


module.exports ={
    readData,
    createData,
    deleteData
};