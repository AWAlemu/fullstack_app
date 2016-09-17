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
	
	getAndDisplayItems();
});
