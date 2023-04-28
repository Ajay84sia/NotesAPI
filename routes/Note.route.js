const express = require('express');
const noteRouter = express.Router();
const { NoteModel } = require('../model/Note.model')

noteRouter.post("/create", async (req, res) => {
    try {
        const note = new NoteModel(req.body)
        await note.save()
        res.status(200).send({ 'msg': 'New Note has been added' })
    } catch (error) {
        res.status(400).send({ "error": error.message })
    }
})

noteRouter.get("/", async (req, res) => {
    try {
        const notes = await NoteModel.find({ authorID: req.body.authorID })
        res.status(200).send(notes)
    } catch (err) {
        res.status(400).send({ "err": err.message })
    }

})

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