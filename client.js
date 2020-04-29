// Template instructions object. The property key, is the variable {{name}} in the template
// and the value is the response key name.
var tpl_inst = {
    title: 'topic_title',
    details: 'topic_details',
    expected: 'expected_result',
    state: 'status, boldItalic',
    name: 'author_name',
    email: 'author_email',
    dated: 'submit_date, formatDate',
    level: 'target_level, boldItalic'
}
var listOfRequests = document.getElementById('listOfRequests');

function formatDate(dt){
    date =  new Date(dt)
    return date.toLocaleDateString()
}
function boldItalic(txt){
    return '<b><i>'+txt+'</i></b>'
}

/**
 * 
 * @param {String} tpl The HTML of the template with its variable in the form {{varName}}
 * @param {Object} tpl_inst The template instructions or mapping that maps each template variable as a key to its expected response key name
 * @param {Object} res The response data object that obeyes the instructions in tpl_inst
 * @returns {String} The rendered HTML template with its variables values.
 */
function render_tpl(tpl, tpl_inst, res) {
    var output = tpl // From /template.js
    let value = '';
    Object.keys(tpl_inst).forEach((k) => {
        let filters = tpl_inst[k].split(',');
        if (filters.length > 1){
            tpl_inst[k] = tpl_inst[k].trim(filters[0])            
            value = window[filters[1].trim()](res[filters[0].trim()]);
            
        }
        else{
            value = res[tpl_inst[k]]
        }        
        var replace = "{{" + k + "}}";
        var re = new RegExp(replace, "g");        
        output = output.replace(re, value)
    })
    return output
}

/**
 * After XHR success, it insterts each response item to the listOfRequests videos.
 */

function loadVideos() {
    if (readVideos.readyState === XMLHttpRequest.DONE) {
        if (readVideos.status === 200) {
            var response = JSON.parse(readVideos.responseText);            
            for (var res of response) {                
                listOfRequests.insertAdjacentHTML('beforeend', render_tpl(tpl, tpl_inst, res));                
            }
        } else {
            alert('There was a problem with loading videos list!');
        }
    }
}

function checkSaving() {
    if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            alert('New video request has been created with an ID:\n' + response._id);
            formElements = createForm.elements
            for (i = 0; i < formElements.length; i++) {
                formElements[i].value = '';
            }            
            listOfRequests.insertAdjacentHTML('afterbegin', render_tpl(tpl, tpl_inst, response));
        } else {
            alert('There was a problem with the request.');
        }
    }
}
document.addEventListener('DOMContentLoaded', function () {
    // Getting Videos list.
    readVideos = new XMLHttpRequest();
    readVideos.onreadystatechange = loadVideos;
    readVideos.open("GET", 'http://localhost:7777/video-request', true);    
    readVideos.send();
    //
    // Handling the form, preparing the form's data and submitting the form via XHR
    const createForm = document.getElementById('createForm');
    createForm.addEventListener('submit', (e) => {        
        e.preventDefault()
        xhr = new XMLHttpRequest();
        xhr.onreadystatechange = checkSaving;
        xhr.open("POST", "http://localhost:7777/video-request", true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        data = new FormData(createForm);
        postData = ''
        for (i of data.entries()) {
            postData += i[0] + '=' + i[1] + '&'
        }        
        xhr.send(postData)
    });
    //
});
