const express = require('express');
const { UserModel } = require('../model/User.model')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userRouter = express.Router()

userRouter.post("/register", async (req, res) => {
    //Logic
    const { email, pass, name, age } = req.body
    try {
        bcrypt.hash(pass, 5, async(err, hash) => {
            // Store hash in your password DB.
            const user = new UserModel({ email, name, age, pass: hash })
            await user.save()
            res.status(200).send({ "msg": "New user has been registered" })
        });

    } catch (err) {
        res.status(400).send({ "err": err.message })
    }

})

userRouter.post("/login", async (req, res) => {
    //Logic
    const { email, pass } = req.body
    try {
        const user = await UserModel.findOne({ email})
        if (user) {
            bcrypt.compare(pass, user.pass, (err, result)=>{
                // result == true
                if(result){
                    const token = jwt.sign({ authorID: user._id , author : user.name}, "masai");
                    res.status(200).send({ "msg": "Login Succesfull", token })
                }else{
                    res.status(200).send({ "msg": "Wrong Credentials!!!" })
                }
            });

        } else {
            res.status(200).send({ "msg": "Wrong Credentials!!!" })
        }
    } catch (error) {
        res.status(400).send({ "err": err.message })
    }
})

module.exports = {
    userRouter
}