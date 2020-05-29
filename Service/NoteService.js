// Update with your config settings.
require('dotenv').config();

const knex = require('knex')({
    client: 'postgresql',
    connection: {
        database:   process.env.DATABASE_NAME,
        user:       process.env.DATABASE_USERNAME,
        password:   process.env.DATABASE_PASSWORD
    }
});

class NoteService{
    constructor(){
        this.notes = []
    }

    // Read from the current notes file and return the specific users notes
    async listNotes(user){
        let results = await knex
            .select('title','date','content', 'notes.id')
            .from("notes")
            .innerJoin("users","notes.user_id","users.id")
            .where("username", user)
            .catch((err) => console.log(err))
        
        this.notes = []

        for (let note of results){
            note.date = getDate(note.date)
            this.notes.push(note)
        }

        return this.notes
    }

    // Reads from the current notes file and appends the new note to the users list
    async addNote(note, user){
        let results = await knex
            .select('id')
            .from("users")
            .where('username', user)
            .catch((err) => console.log(err))
        
        await knex('notes')
            .insert({title: note.title, date: new Date(), content: note.content, user_id: results[0].id})
            .catch((err) => console.log(err))

        await this.listNotes(user)

        return this.notes
    }

    // Reads from the current notes file and indexes the note to be updated and replaces it.
    async updateNote(note, index, user){      
        await knex('notes')
            .update({title: note.title, date: new Date(), content: note.content})
            .where('id', index)
            .catch((err) => console.log(err))

        await this.listNotes(user)

        return this.notes
    }
    
    // Reads from the current notes file and indexes the note to be updated and deletes it.
    async removeNote(index, user){
        await knex('notes')
            .del()
            .where('id', index)
            .catch((err) => console.log(err))

        await this.listNotes(user)

        return this.notes
    }
}

// Get the current day in DD/MM/YY format
function getDate(date) {
    let dd = date.getDay();
    let mm = date.getMonth() + 1;
    let yyyy = date.getFullYear();

    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    return dd + '/' + mm + '/' + yyyy;
}

module.exports = NoteService;