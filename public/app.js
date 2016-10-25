function displayItems(data) {
    $('#list-results').empty();
    for (var item in data) {
        appendItem(data[item].name, data[item]._id, data[item].checked);
    }
}

function appendItem(item, id, checked) {
    if (item) {
        var itemElement = $('#item-template .item-box').clone();
        itemElement.attr('id', id);

        var check = itemElement.find('.check');
        check.attr('class', id);

        var itm = itemElement.find('.name');
        itm.text(item);

        $('#list-results').append(itemElement);
        if (checked) {
            checkUncheck(id);
        }
    }
}

function renderEditItem(name, id) {
    if (name && id) {
        var inputEditer = $('#item-template .edit-item').clone();

        var input = inputEditer.find('input');
        input.val(name);

        $('#' + id + ' .item').hide();
        $('#' + id).append(inputEditer);
    }
}

function checkUncheck(id) {
    $('#' + id + ' .name').toggleClass('checked');
    $('#' + id + ' #check').toggleClass('checked');
}

$(document).ready(function() {
    var userInput = $('input[name=item]');
    var itemForm = $('#item-form');
    
    //post item to list
    itemForm.submit(function(e){
        e.preventDefault();
        var item = userInput.val();
        item = item.trim();
        userInput.val('');
        postItem(item);
    });
    //put edited item on keypress
    $('ul').submit(function(e) {
        e.preventDefault();
        var target = e.target;
        var id = target.parentElement.parentElement.id;
        var name = $('#' + id + ' input').val();
        putItem(id, name, false);
    });
    //mark item checked or uncheck
    $('ul').on('click', '#check', function(e) {
        var id = this.parentElement.parentElement.id;
        putItem(id, '', true);
        checkUncheck(id);
    });
    //delete item event
    $('ul').on('dblclick', '#check', function(e) {
        var id = this.parentElement.parentElement.id;
        deleteItem(id);
        $('#' + id).fadeOut(300);
    });
    //edit item event
    $('ul').on('dblclick', '.item-box', function(e) {
        var id = this.id;
        var name = e.target.innerText;
        renderEditItem(name, id);
    });
    //submit login form event
    $('#login-form').on('submit', function(e) {
        e.preventDefault();
        var username = $('#login-form #usernameL').val();
        var password = $('#login-form #passwordL').val();
        $('#login-form #usernameL, #passwordL').val('');
        submitSignin(username, password);
    });
    //submit signup form
    $('#signup-form').on('submit', function(e) {
        e.preventDefault();
        var username = $('#username').val();
        var password = $('#password').val();
        var confPass = $('#confirm-password').val();
        $('#usernameErr, #passwordErr, #conf-passwordErr').text('');
        validateSignupForm(username, password, confPass);
        $('#signup-form #username, #password, #confirm-password').val('');
    });
    //signout event
    $('#signout-btn').on('click', logout);
    
    checkSession();
});

function validateSignupForm(username, password, confPass) {
    var valid = true;
    if (username.length < 4) {
        $('#usernameErr').text('must be at least 4 characters long');
        valid = false;
    } 
    if (password.length < 8) {
        $('#passwordErr').text('must be at least 8 characters long');
        valid = false;
    } 
    if (password !== confPass) {
        $('#conf-passwordErr').text('must match password');
        valid = false;
    } 
    if(valid) {
        postSignupForm(username, password);
    }
}

function submitSignin(username, password) {
    var user = {
        username: username,
        password: password
    };
    var ajax = $.ajax('/hidden', {
        type: 'POST',
        data: JSON.stringify(user),
        dataType: 'json',
        contentType: 'application/json'
    });
    ajax.done(function(res) {
        if (res.success) {
            renderUserHomePage();
            getItems();
        }
    }).fail(function(err) {
        renderLoginPage();
    });
}

function logout() {
    var ajax = $.ajax('/logout', {
        type: 'GET',
    });
    ajax.done(function(res) {
        renderLoginPage();
    });
}

function postSignupForm(username, password) {
    var item = {
        'username': username,
        'password': password
    };
    var ajax = $.ajax('/users', {
        type: 'POST',
        data: JSON.stringify(item),
        dataType: 'json',
        contentType: 'application/json'
    });
    ajax.done(function(res) {
        $('#signup-success').show();
    }).fail(function(err) {
        if (err.responseJSON.code == 11000) {
            userNameTaken();
        }
    });
}

function userNameTaken() {
    $('#usernameErr').text('username is already in use');
}

function renderUserHomePage() {
    $('.login-signup-screen').hide();
    $('.user-home-page').show();
};

function renderLoginPage() {
    $('.user-home-page').hide();
    $('.login-signup-screen').show();
}

function checkSession() {
    var ajax = $.ajax('/authenticate', {
        type: 'GET',
        dataType: 'json'
    });
    ajax.done(function(res) {
        if (!res.success) {
            renderLoginPage();
        } else {
            renderUserHomePage();
            getItems();

        }
    }).fail(function(err) {
        renderLoginPage();
    });
}

function postItem(name) {
    var item = { 'name': name };
    var ajax = $.ajax('/API/items', {
        type: 'POST',
        data: JSON.stringify(item),
        dataType: 'json',
        contentType: 'application/json'
    });
    ajax.done(function(res) {
        getItems();
    });
}

function putItem(id, name, check) {
    var item = {
        _id: id,
        name: name,
        check: check,
    };
    var ajax = $.ajax(('/API/items/' + id), {
        type: 'PUT',
        data: JSON.stringify(item),
        dataType: 'json',
        contentType: 'application/json'
    });
    ajax.done(function(res) {
        getItems();
    });
}

function getItems() {
    var ajax = $.ajax(('/API/items'), {
        type: 'GET',
        dataType: 'json'
    });
    ajax.done(function(res) {
        displayItems(res);
    });
}

function deleteItem(id) {
    var item = { _id: id };
    var ajax = $.ajax(('API/items/' + id), {
        type: 'DELETE',
        data: JSON.stringify(item),
        dataType: 'json',
        contentType: 'application/json'
    });
    ajax.done(function(res) {
        getItems();
    });
}