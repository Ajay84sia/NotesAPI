const express = require('express');
const { UserModel } = require('../model/User.model')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userRouter = express.Router()

/**
 * @swagger
 * components:
 *  schemas:
 *      User:
 *          type: object
 *          properties:
 *              name:
 *                  type: string
 *                  description: "name of the user"
 *              email:
 *                  type: string
 *                  description: "email of the user"
 *              pass:
 *                  type: string
 *                  description: "password of the user"
 *              age:
 *                  type: Number
 *                  description: "age of the user"
 *                      
 *                  
 *                 
 */

/**
 * @swagger
 * tags:
 *  name: Users
 *  description: All the API routes related to Users
 */

/**
* @swagger
* /users/register:
*  post:
*      summary: This will help you to register the new user inside the database.
*      tags: [Users]
*      responses:
*          200:
*              description: New user has been registered                          
*          400:
*              description: Incorrect Request!!
*/


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

/**
* @swagger
* /users/login:
*  post:
*      summary: This will help you to login through the registered credentials.
*      tags: [Users]
*      responses:
*          200:
*              description: Login Successful!                          
*          400:
*              description: Incorrect Request!!
*/


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