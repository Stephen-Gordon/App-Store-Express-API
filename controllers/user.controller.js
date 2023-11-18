const User = require('../models/user.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const register = async (req, res) => {
    try {
        // create new user
        let newUser = new User(req.body)
        // hash the password
        newUser.password = bcrypt.hashSync(req.body.password, 10)
        // save the user
        const user = await newUser.save();
        user.password = undefined;
        //return the user without the password
        return res.status(201).json({
            data: user
        });
    } catch (err) {
        return res.status(400).json({
            msg: err
        });
    }
};


const login = async (req, res) => {
    try {
        // find by email
        const user = await User.findOne({ email: req.body.email });
        
        let token = null;

        if (!user || !user.comparePassword(req.body.password)) {
            return res.status(401).json({
                msg: 'Authentication failed, username or password is wrong'
            });
        }
        // create JWT token
        token = jwt.sign({
            email: user.email,
            full_name: user.full_name,
            role: user.role,
            _id: user._id 
            //role
        } , process.env.JWT_SECRET);

        res.status(200).json({
            msg: 'Login successful',
            token: token
        });


    } catch (err) {
        return res.status(400).json({
            msg: err
        });
    }
};

const loginRequired = (req, res, next) => {
    if(req.user) {
        next()
    }
    else {
        return res.status(401).json({
            msg: 'Unauthorized user'
        })
    }
}

const profile = async (req, res) => {
    try {
        const id = req.params.id;

        // get a user by id 
        // populate it with selected properties
        const data = await User.findById(id)
            .populate({ path: 'appsDownloaded', select: '_id name' })
            .populate({ path: 'reviews', select: '_id content' });

        if (!data) {
            return res.status(404).json({ msg: `user ${id} not found` });
        }
        // return the user without password
        data.password = undefined;

        res.status(200).json(data);
    } catch (err) {
        if (err.name === 'CastError') {
            res.status(404).json({ msg: `App ${id} not found` });
        } else {
            res.status(500).json(err);
        }

        console.error(`Error ${err}`);
    }
};

const deleteData = async (req, res) => {
    try {
        
        const id = req.params.id

        // get user id
        const user = req.user
        
        
        
        
        // Delete user by id
        deleteUser = await User.findByIdAndDelete(id)
        


        if (!deleteUser) {
            res.status(404).json({ msg: `User ${id} not found` });
            return; 
        }


        // delete all reviews by user
        await Review.deleteMany({user: id})

        res.status(200).json({
            msg: `User ${id} deleted`
        })

        
    } catch(err) {
        if (err.name === 'CastError') {
            res.status(404).json({ msg: `App ${id} not found` });
        } else {
            res.status(500).json(err);
        }

        console.error(`Error ${err}`);
    }


}

module.exports ={
    register,
    login,
    profile,
    deleteData,
    loginRequired
};