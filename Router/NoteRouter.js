const express = require('express');
let router = express.Router()

class NoteRouter {
    constructor(noteService) {
        this.noteService = noteService
        this.router = router
    }

    // Function to bind the NoteRouter functions to particular requests
    route() {
        this.router.get('/', this.get.bind(this));
        this.router.post('/', this.post.bind(this));
        this.router.put('/', this.put.bind(this));
        this.router.delete('/', this.delete.bind(this));
        return this.router
    }

    // If a GET request is received then list the users notes 
    get(req, res) {
        return this.noteService.listNotes(req.auth.user)
            .then((notes) => {
                console.log(notes)
                res.send(notes)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    // If a POST request is received then add a new note to the users note list
    post(req, res) {
        let note = {
            "title": req.body.title,
            "date": req.body.date,
            "content": req.body.content
        }
        return this.noteService.addNote(note, req.auth.user)
            .then((notes) => {
                res.send(notes)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    // If a POST request is received then update the specified note
    put(req, res) {
        console.log(req)

        let note = {
            "title": req.body.title,
            "date": req.body.date,
            "content": req.body.content
        }
        return this.noteService.updateNote(note, req.body.index, req.auth.user)
            .then((notes) => {
                res.send(notes)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    // If a DELETE request is received then delete the specified note
    delete(req, res) {
        return this.noteService.removeNote(req.body.index, req.auth.user)
            .then((notes) => {
                res.send(notes)
            })
            .catch((err) => {
                console.log(err)
            })
    }
}

module.exports = NoteRouter