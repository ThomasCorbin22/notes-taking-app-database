let index
let noteNumber

// On load, get the current notes and display them
$(() => {
    axios({
        url: '/app-01/notes',
        method: 'get'
    })
    .then((res) => {
        console.log(res.data);
        index = res.data[0].id

        noteNumber = res.data.length

        updateMainNote(res.data, index)
        reloadNotes(res.data)
        getNote()
    })
    .catch((error) => {
        console.log(error);
    })
})

// On any click of the delete button, send a DELETE request with the id of the current note. Unless it is the final note, then reset the note to default settings.
$('#delete').click(() => {
    if (noteNumber > 1){
        axios({
            url: '/app-01/notes',
            method: 'DELETE',
            data: { 'index': index }
        })
        .then((res) => {
            console.log(res.data);
            index = res.data[0].id
            noteNumber = res.data.length
            
            updateMainNote(res.data, index)
            reloadNotes(res.data)
            getNote()
    
            $('#number').html(`You have ${noteNumber} notes:`)
        })
        .catch((error) => {
            console.log(error);
        })
    }
    else if (noteNumber <= 1) {
        axios({
            url: '/app-01/notes',
            method: 'PUT',
            data: {
                'title': 'New Note',
                'date': getDate(new Date()),
                'content': 'Write Something here',
                'index': index
            }
        })
        .then((res) => {
            console.log(res.data);
            updateMainNote(res.data, index)
            reloadNotes(res.data)
            getNote()
        })
        .catch((error) => {
            console.log(error);
        })
    }
})

// On any click of the save button send a PUT request with the id and new note information
$('#save').click(() => {
    axios({
        url: '/app-01/notes',
        method: 'PUT',
        data: {
            'title': $('#main-title').val(),
            'date': getDate(new Date()),
            'content': $('.ql-editor').html(),
            'index': index
        }
    })
    .then((res) => {
        console.log(res.data);
        updateMainNote(res.data, index)
        reloadNotes(res.data)
        getNote()
    })
    .catch((error) => {
        console.log(error);
    })
})


// On click of the add note button, create a new blank note for using
$('#addNote').click(() => {
    axios({
        url: '/app-01/notes',
        method: 'POST',
        data: {
            'title': 'New Note',
            'date': getDate(new Date()),
            'content': 'Write Something here'
        }
    })
    .then((res) => {
        console.log(res.data);
        noteNumber = res.data.length
        index = res.data[noteNumber - 1].id

        updateMainNote(res.data, index)
        reloadNotes(res.data)
        getNote()

        $('#number').html(`You have ${noteNumber} notes:`)
    })
    .catch((error) => {
        console.log(error);
    })
})

// Every time a key is entered into the search bar, search through the notes titles and content to see if they match, hide if they do not
$('#search-bar').on('keyup', (event) => {
    let query = $(event.target).val().toLowerCase()
    if (query.length > 0) {
        $('#search-icon').removeClass('fa fa-search')
        $('#search-icon').addClass('fas fa-times')
    }
    else {
        $('#search-icon').removeClass('fas fa-times')
        $('#search-icon').addClass('fa fa-search')
    }
    $('.note').each((index, element) => {
        let title = $(element).find('.thumb-title').html().toLowerCase()
        let content = $(element).find('.thumb-content').html().toLowerCase()
        if (title.includes(query) || content.includes(query)) {
            $(element).show()
        }
        else {
            $(element).hide()
        }
    })
})

// Reset the search icon and remove input from the search bar when clicked
$('#search-button').click((event) => {
    event.preventDefault()
    if ($('#search-bar').val().length > 0) {
        $('#search-bar').val('')
        $('.note').each((index, element) => {
            $(element).show()
        })
        $('#search-icon').removeClass('fas fa-times')
        $('#search-icon').addClass('fa fa-search')
    }
})

// Trim any strings that are longer than a certain length.
function trimString(string, length) {
    return string.substring(0, length) + '...'
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

// Update the main note the new title, date and content
function updateMainNote(data, index) {
    let note = data.filter((item) => item.id == index)[0]

    $('#main-title').val(note.title)
    $('#main-date').html(note.date)
    $('.ql-editor').html(note.content)
}

// Get the current note that has been clicked on to display in the main content area
function getNote() {
    $('.note').on('click', (event) => {
        let id

        if ($(event.target).attr('id') === undefined) {
            id = $(event.target).parents('.note').attr('id')
        }
        else {
            id = $(event.target).attr('id')
        }

        axios({
            url: '/app-01/notes',
            method: 'GET'
        })
        .then((res) => {
            console.log(res.data);
            index = id

            updateMainNote(res.data, index)
        })
        .catch((error) => {
            console.log(error);
        })
    })
}

// Using handlebars CDN to reload the notes
let notesTemplate = Handlebars.compile(
    `
    {{#each notes}}
    <div id={{id}} class="note card btn btn-success text-left">
        <div class="card-body p-1 bg-success">
            <h5 class="thumb-title card-title mb-0">{{title}}</h5>
            <p class="thumb-content card-text mb-0 light-grey-color">{{content}}</p>
            <small class="thumb-date card-text light-grey-color">{{date}}</small>
        </div>
    </div>
    {{/each}}
      `
);

function reloadNotes(notes) {
    for (let note of notes){
        note.content = stripHtml(note.content)
        if (note.content.length > 50){
            note.content = trimString(note.content, 50)
        }
        if (note.title.length > 15){
            note.title = trimString(note.title, 15)
        }
    }

    $("#notes").html(notesTemplate({ notes: notes }));
};

function stripHtml(html)
{
   let tmp = document.createElement("div");
   tmp.innerHTML = html;
   return tmp.textContent || tmp.innerText || "";
}