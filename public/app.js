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
	authenticate();
    var userInput = $('input[name=item]');
	var addButton = $('#add-to-list');

	addButton.mouseup(function(e) {
		var item = userInput.val();
	    userInput.val('');
		postItem(item);
	});
    //post item on keypress
    userInput.on('keypress', function(e) {
		if (e.keyCode === 13) {
			var item = userInput.val();
			userInput.val('');
			e.preventDefault();
			postItem(item);
	   }
	});
	//put edited item on keypress
	$('ul').on('keypress', '.input-edit', function(e) {
		if (e.keyCode === 13) {
			e.preventDefault();

			var id = this.parentElement.parentElement.parentElement.id;
			var name = $('#' + id + ' input').val();
			putItem(id, name, false);
	   }
	});
	//submit edit event
	$('ul').on('click', '.edit-icon', function(e) {
		var id = this.parentElement.parentElement.id;
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
	$('ul').on('dblclick', '.item-box', function(e){
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
	//submit signou form
	$('#signup-form').on('submit', function(e) {
		e.preventDefault();
		validateSignupForm();
		$('#signup-form #username, #password, #confirm-password').val('');
		$('#usernameErr, #passwordErr, #confPass').text('');
	});
	//signout event
	$('#signout-btn').on('click', function() {
		logout();
	})
});

function validateSignupForm() {
	var username = $('#username').val();
	var password = $('#password').val();
	var confPass = $('#confirm-password').val();
	if(username.length < 4) {
		$('#usernameErr').text('must be at least 4 characters long');
	} else if(password.length < 8) {
		$('#passwordErr').text('must be at least 8 characters long');
	} else if(password !== confPass) {
		$('#conf-passwordErr').text('must match password');
	} else {
		postSignupForm(username, password);
	}
}

function submitSignin(username, password) {
	var user = {username: username,
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
    	authenticate();
    });
}

function logout() {
	var ajax = $.ajax('/logout', {
		type: 'GET',
	});
	ajax.done(function(res) {
		authenticate();
	});
}

function postSignupForm(username, password) {
	var item = {'username': username,
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
    	if(err.responseJSON.code == 11000) {
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

function authenticate() {
	var ajax = $.ajax('/authenticate', {
		type: 'GET',
		dataType: 'json'
	});
	ajax.done(function(res) {
	    if(!res.success) {
	    	renderLoginPage();
	    } else {
	    	renderUserHomePage();
	    	getItems();

	    }
	}).fail(function(err) {
		renderLoginPage();
	})
}

function postItem(name) {
	var item = {'name': name};
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
	var item = {_id: id};
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