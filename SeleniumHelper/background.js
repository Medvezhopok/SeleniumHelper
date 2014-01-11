// Copyright (c) 2014 Medvezhopok. All rights reserved.

function getClickHandler(info, tab) {
	chrome.tabs.sendRequest(tab.id, "getClickedEl", function(response) {
		
	});
};

chrome.contextMenus.create({
	"title" : "Get element selenium selector",
	"type" : "normal",
	"contexts" : ["all"],
	"onclick" : getClickHandler
});
