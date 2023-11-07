const App = require('../models/app.model')
const User = require('../models/user.model')
const Review = require('../models/review.model')
const readData = (req, res) => {


    App.find({})
    //.populate(['reviews', 'users'])
    .populate({
        path: 'users',
        select: 'full_name email id'
      })
      .populate({
        path: 'reviews',
      })
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
    .populate({
        path: 'users',
        select: '-password -createdAt -updatedAt'
      })
      .populate({
        path: 'reviews',
      })
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
    // need to check for duplicated when adding to appsDownloaded array
    App.findByIdAndUpdate(id, data, { new: true })
        .then(newData => {
            let userId = newData.users;

            User.findByIdAndUpdate(userId, { $push: { appsDownloaded: newData._id } }, { new: true })
                .then(updatedUser => {
                    res.status(201).json({
                        msg: `You Updated App ${id}`,
                        data: newData,
                    });
                })
                .catch(err => {
                    console.error(`Error updating user: ${err}`);
                    res.status(500).json(err);
                });
        })
        .catch(err => {
            // Check for cast Error
            if (err.name === 'CastError') {
                res.status(404).json({ msg: `App ${id} not found` });
            } else {
                console.error(`Error updating app: ${err}`);
                res.status(500).json(err);
            }
        });
};


const deleteData = async (req, res) => {
    try {

        //app id
        const id = req.params.id;

        // first delete the app
        const deleteApp = await App.findByIdAndDelete(id);

        // if the app doesnt exist throw an error
        if (!deleteApp) {
            res.status(404).json({ msg: `App ${id} not found` });
            return; 
        }

       
        // map through the users and delete each review related to the app
        const reviewsToDeleteArray = deleteApp.reviews;

        // updateMany(filter, update, options)
        await Promise.all(
            reviewsToDeleteArray.map(async (reviewId) => {
              await User.updateMany({ reviews: reviewId }, { $pull: { reviews: reviewId } });
            })
          );


        // Delete the app from all users who have it downloaded
        await User.updateMany({ appsDownloaded: id }, { $pull: { appsDownloaded: id } });
        

        // Delete all the app's reviews
        await Review.deleteMany({ app: id });

        res.status(200).json({
            msg: `You deleted App ${id}`,
            data: deleteApp
        });
    } catch (err) {
        if (err.name === 'CastError') {
            res.status(404).json({ msg: `App ${id} not found` });
        } else {
            res.status(500).json(err);
        }

        console.error(`Error ${err}`);
    }
};



module.exports ={
    readData,
    readOne,
    createData,
    updateData,
    deleteData
};