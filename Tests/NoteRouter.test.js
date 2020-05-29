const NoteRouter = require('../Router/NoteRouter')

let noteService
let response
let noteRouter

describe('Noterouter testing with noteservice', () => {
    
    let note = {
        "title": "Note 1",
        "date": "Today",
        "content": "Some stuff here"
    }

    beforeEach(() => {
        noteService = {
            listNotes : jest.fn().mockResolvedValue(true),
            addNote : jest.fn().mockResolvedValue(true),
            removeNote : jest.fn().mockResolvedValue(true),
            updateNote : jest.fn().mockResolvedValue(true)
        }
        noteRouter = new NoteRouter(noteService)
    })

    test('noteRouter should call listNotes in response to a get request', () => {
        expect.assertions(1);
        
        return noteRouter.get({
            auth: {
                user: 'tom'
            }
        }, response).then(() => {
            expect(noteService.listNotes).toHaveBeenCalledWith('tom')
        })
    })

    test('noteRouter should call addNote in response to a post request', () => {
        expect.assertions(1);
        
        return noteRouter.post({
            auth: {
                user: 'tom'
            },
            body: {
                title: "Note 1",
                date: "Today",
                content: "Some stuff here",
            }
        }, response).then(() => {
            expect(noteService.addNote).toHaveBeenCalledWith(note, 'tom')
        })
    })

    test('noteRouter should call updateNote in response to a put request', () => {
        expect.assertions(1);

        return noteRouter.put({
            auth: {
                user: 'tom'
            },
            body: {
                title: "Note 1",
                date: "Today",
                content: "Some stuff here",
                index: 0,
            }
        }, response).then(() => {
            expect(noteService.updateNote).toHaveBeenCalledWith(note, 0, 'tom')
        })
    })

    test('noteRouter should call deleteNote in response to a delete request', () => {
        expect.assertions(1);

        return noteRouter.delete({
            auth: {
                user: 'tom'
            },
            body: {
                index: 0,
            }
        }, response).then(() => {
            expect(noteService.removeNote).toHaveBeenCalledWith(0, 'tom')
        })
    })
})