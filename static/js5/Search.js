var SearchPanel = function() {
	"use strict";
	var self = {};

	var container;
	var el;
	var scroller;
	var input;

	BOOTSTRAP.on_init.push(function(root_template) {
		container = root_template.search_results_container;
		el = root_template.search_results;
		input = root_template.search;

		container.addEventListener("click", function(e) {
			e.stopPropagation();
		});

		root_template.search_close.addEventListener("click", function() {
			Router.change();
		});

		root_template.search_link.addEventListener("click", function() {
			if (!document.body.classList.contains("search_open")) {
				Router.change("search");
			}
			else {
				Router.change();
			}
		});

		root_template.search_form.addEventListener("submit", do_search);
	});

	BOOTSTRAP.on_draw.push(function(root_template) {
		scroller = Scrollbar.create(container, false, true);
	});

	var do_search = function(e) {
		e.preventDefault();
		e.stopPropagation();
		if (Formatting.make_searchable_string(input.value).length < 3) {
			search_error();
		}
		API.async_get("search", { "search": input.value }, search_result, search_error);
	};

	var search_result = function(json) {
		while (el.hasChildNodes()) {
			el.removeChild(el.lastChild);
		}
		RWTemplates.search_results(json, el);
		for (var i = 0; i < json.songs.length; i++) {
			Fave.register(json.songs[i]);
			Rating.register(json.songs[i]);
			if (json.songs[i].requestable) {
				Requests.make_clickable(json.songs[i].$t.title, json.songs[i].id);
			}
			SongsTableDetail(json.songs[i], (i > json.songs.length - 4));
		}
	};

	var search_error = function() {
		console.log("wat");
	};

	var search_reset_error = function() {
		console.log("unwat");
	};

	return self;
}();