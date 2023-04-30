const express = require('express');
const noteRouter = express.Router();
const { NoteModel } = require('../model/Note.model')

/**
 * @swagger
 * components:
 *  schemas:
 *      Note:
 *          type: object
 *          properties:
 *              title:
 *                  type: string
 *                  description: "title of note"
 *              body:
 *                  type: string
 *                  description: "body of note"
 *              author:
 *                  type: string
 *                  description: "body of note"
 *              authorID:
 *                  type: string
 *                  description: "body of note"
 *              category:
 *                  type: string
 *                  description: "category of note"
 *                      
 *                  
 *                 
 */

/**
 * @swagger
 * tags:
 *  name: Notes
 *  description: All the API routes related to Notes
 */

/**
 * @swagger
 * /notes:
 *  get:
 *      summary: This will get all the notes data related to a particular user from the database.
 *      tags: [Notes]
 *      responses:
 *          200:
 *              description: The list of all the notes of a particular user                           
 *          400:
 *              description: Incorrect Request!!
 */

noteRouter.get("/", async (req, res) => {
    try {
        const notes = await NoteModel.find({ authorID: req.body.authorID })
        res.status(200).send(notes)
    } catch (err) {
        res.status(400).send({ "err": err.message })
    }

})

/**
 * @swagger
 * /notes/create:
 *  post:
 *      summary: This will help you to post the notes inside the database.
 *      tags: [Notes]
 *      responses:
 *          200:
 *              description: New Note has been added                          
 *          400:
 *              description: Incorrect Request!!
 */

noteRouter.post("/create", async (req, res) => {
    try {
        const note = new NoteModel(req.body)
        await note.save()
        res.status(200).send({ 'msg': 'New Note has been added' })
    } catch (error) {
        res.status(400).send({ "error": error.message })
    }
})

/**
 * @swagger
 * /notes/update/{noteID}:
 *  patch:
 *      summary: This will help you to update the particular note of a particular user.
 *      tags: [Notes]
 *      responses:
 *          200:
 *              description: The note with noteID has been updated                         
 *          400:
 *              description: Incorrect Request!!
 */


noteRouter.patch("/update/:noteID", async (req, res) => {
    const { noteID } = req.params;
    const note = await NoteModel.findOne({ _id: noteID })
    try {
        if (req.body.authorID !== note.authorID) {
            res.status(200).send({ "msg": "You are not authorized to perform this action" })
        } else {
            await NoteModel.findByIdAndUpdate({ _id: noteID }, req.body)
            res.status(200).send(`The note with id:${noteID} has been updated`)
        }
    } catch (err) {
        res.status(400).send(err)
    }

})

/**
 * @swagger
 * /notes/delete/{noteID}:
 *  delete:
 *      summary: This will help you to delete the particular note of a particular user.
 *      tags: [Notes]
 *      responses:
 *          200:
 *              description: The note has been deleted from the database                         
 *          400:
 *              description: Incorrect Request!!
 */

noteRouter.delete("/delete/:noteID", async (req, res) => {
    const { noteID } = req.params;
    const note = await NoteModel.findOne({ _id: noteID })
    try {
        if (req.body.authorID !== note.authorID) {
            res.status(200).send({ "msg": "You are not authorized to perform this action" })
        } else {
            await NoteModel.findByIdAndDelete({ _id: noteID })
            res.status(200).send(`The note with id:${noteID} has been deleted`)
        }
    } catch (err) {
        res.status(400).send(err)
    }

})


module.exports = {
    noteRouter
}