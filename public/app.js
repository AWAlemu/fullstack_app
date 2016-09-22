var MOCK_ITEMS = {
	'items': [
		{
			'id': '11111',
			'name': 'Item 1'
		},
		{
			'id': '22222',
			'name': 'Item 2'
		},
		{
			'id': '33333',
			'name': 'Item 3'
		}
		]
};

function getItems(callback) {
	setTimeout(function() {callback(MOCK_ITEMS)}, 100);
}

function displayItems(data) {
	for (var i = 0; i < data.items.length; i++) {
		appendItem(data.items[i].name, data.items[i].id);
	}
}

function getAndDisplayItems() {
	getItems(displayItems);
}

function postItem(item) {
	
}

function appendItem(item, id) {
	if (item != "") {
		$('ol').append('<li id='+ id +'>' + item + '</li>');
	}
}

$(document).ready(function() {
    var userInput = $('input[name=item]');
	var addButton = $('#add-to-list');

	addButton.mouseup(function(e) {
		var item = userInput.val();
	    userInput.val('');
		postItem(item);
	});
    userInput.on('keypress', function(e) {
	   if (e.keyCode === 13) {
	      var item = userInput.val();
	      userInput.val('');
	      e.preventDefault();
          postItem(item);
	   }
	});
	$('ol').on('dblclick', 'li', function() {
		$(this).fadeOut(500);
	});
	$('ol').on('click', 'li', function(){
		$(this).toggleClass('checked');
	});
	$('#login-form').on('submit', function(e) {
		e.preventDefault();
		var username = $('#login-form #usernameL').val();
		var password = $('#login-form #passwordL').val();
		$('#login-form #usernameL, #passwordL').val('********');
		submitSignin(username, password);
	});
	$('#signup-form').on('submit', function(e) {
		e.preventDefault();
		validateSignupForm();
		$('#signup-form #username, #password, #confirm-password').val('');
		$('#usernameErr, #passwordErr, #confPass').text('');
	});
	getAndDisplayItems();
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
				console.log(user);
    var ajax = $.ajax('/hidden', {
        type: 'POST',
        data: JSON.stringify(user),
        dataType: 'json',
        contentType: 'application/json'
    });
    ajax.done(function(res) {
		console.log('res', res);
		// if (res.body.access){
		//  showhtml
		// } else {
		// 	logiin requre
		// }
		signinSuccessful();
		// signinSuccessful();
    }).fail(function(err) {
    	console.log( err);
    	// if(err.responseJSON.code == 11000) {
    	// 	userNameTaken();
    	// }
    });
}

function logout() {
	var ajax = $.ajax('/logout', {
		type: 'GET',
		
	}
	)
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
		signupSuccessful();
    }).fail(function(err) {
    	if(err.responseJSON.code == 11000) {
    		userNameTaken();
    	}
    });
}

function userNameTaken() {
	$('#usernameErr').text('username is already in use');
}

function signupSuccessful() {
	$('#signup-success').show();
};

function signinSuccessful() {
	renderUserHomePage();
	// getUserData();
};

function renderUserHomePage() {
	$('#login-signup-screen').hide();
	$('.user-home-page').show();
};

function getUserData() {
	var ajax = $.ajax('/items', {
        type: 'GET',
        dataType: 'json'
    });
    ajax.done(function(res) {
    	
    }).fail(function(err) {
    	
    });
};