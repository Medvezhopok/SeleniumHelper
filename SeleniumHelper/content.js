// Copyright (c) 2014 Medvezhopok. All rights reserved.

var clickedEl = null;

document.addEventListener("mousedown", function(event){
	//right click
	if(event.button == 2) { 
		clickedEl = event.target;
	}
}, true);

function getElementCSSSelector(element) {
	if (!element || !element.localName)
		return "null";

	var label = element.localName;
	if (element.id)
		label += "#" + element.id;

	if (element.classList) {
		for (var i = 0, len = element.classList.length; i < len; ++i)
			label += "." + element.classList[i];
	}

	return label;
}

function getCss(element) {
	var paths = [];

	for (; element && element.nodeType == Node.ELEMENT_NODE; element = element.parentNode) {
		var selector = getElementCSSSelector(element);
		paths.splice(0, 0, selector);
		if (selector.indexOf("#") >= 0) {
			break;
		}
	}

	return paths.length ? paths.join(" ") : null;
}

function getXPath(element) {
	var node = element;
	var path = [];
	if(node.parentNode) {
		path = getXPath(node.parentNode, path);
	}

	if(node.previousSibling) {
		var count = 1;
		var sibling = node.previousSibling
		do {
			if(sibling.nodeType == 1 && sibling.nodeName == node.nodeName) {count++;}
			sibling = sibling.previousSibling;
		} while(sibling);
		if(count == 1) {count = null;}
	} else if(node.nextSibling) {
		var sibling = node.nextSibling;
		do {
			if(sibling.nodeType == 1 && sibling.nodeName == node.nodeName) {
				var count = 1;
				sibling = null;
			} else {
				var count = null;
				sibling = sibling.previousSibling;
			}
		} while(sibling);
	}

	if(node.nodeType == 1) {
	 	path.push(node.nodeName.toLowerCase() + (node.id ? "[@id='"+node.id+"']" : count > 0 ? "["+count+"]" : ''));
	}
	return path;
}

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	if(request == "getClickedEl") {
		// console.log(clickedEl);
		
		var css = undefined;
		var $clickedEl = $(clickedEl);
		var inners = [];
		
		if (clickedEl.id) {
			inners.push("id=" + clickedEl.id)
		}
		inners.push("css=" + getCss(clickedEl));
		inners.push("xpath=" + getXPath(clickedEl).join("/"));
		$("#SeleniumHelperInfo").remove();
		var $div = $("<div />", {
			id: 'SeleniumHelperInfo',
			style: 	"position: fixed;" +
					"top:0; left:0;"+
					"border: 1px solid black;"
		}).appendTo("body");
		$div.html(inners.join("<br>"));
		console.log(inners.join("\n"));
		sendResponse({data: inners});
	}
});