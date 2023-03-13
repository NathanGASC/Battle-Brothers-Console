var Console = function () {
	this.mSQHandle = null
	this.mID = "Console";
	this.mLogContainer = null
	this.mContainer = null
	this.scrollableContainer = null
	this.mInput = null

	this.cmdHistory = []
	this.cmdIndex = 0;

	this.isDomDebugActivated = false;
}

Console.prototype.onConnection = function (_handle) {
	this.create($('.root-screen'));
	this.mSQHandle = _handle;

	window.console = (function () {
		function Logger() {
		}
		Logger.prototype.log = this.log.bind(this)
		Logger.prototype.warn = this.warn.bind(this)
		Logger.prototype.error = this.error.bind(this)
		Logger.prototype.debug = this.debug.bind(this)
		Logger.prototype.info = this.info.bind(this)

		return new Logger();
	}.bind(this)());

	console.log("Console overwrited")
}

Console.prototype.create = function (_parentDiv) {
	$('.root-screen').append($("<div id=uniqueInfo></div>"))

	this.mContainer = $('<div id="console" class="invisible"/>');
	_parentDiv.append(this.mContainer);

	var logWrapper = $('<div id="logWrapper"/>');
	this.mContainer.append(logWrapper)
	this.scrollableContainer = logWrapper.createList(1, 'content-container')
	this.mLogContainer = logWrapper.findListScrollContainer();

	this.mInput = $('<input id=cmdInput type="text" class="text-font-small font-bold font-color-brother-name" placeholder="Type command..."></input>');
	this.mContainer.append(this.mInput)

	$('#cmdInput').keyup(function (e) {
		var charFromMap = keyCodeToString(e.which)
		switch (charFromMap) {
			case "Up Arrow":
				if (this.cmdIndex + 1 <= 0) return;
				this.mInput.val(this.cmdHistory[--this.cmdIndex])
				break;
			case "Down Arrow":
				if (this.cmdIndex + 1 > this.cmdHistory.length) return;
				if (this.cmdIndex + 1 == this.cmdHistory.length) {
					this.mInput.val("")
				} else {
					this.mInput.val(this.cmdHistory[++this.cmdIndex])
				}
				break;
			case "Enter":
				try {
					var command = this.mInput.val()
					command = command.replace(/[\u0127]/g, '');
					command = command.replace(/\u0127/g, '');
					command = command.replace("", '');
					command = command.replace(//g, '');
					eval(command)
				} catch (error) {
					console.error(error.toString())
				}
				this.cmdHistory.push(this.mInput.val())
				this.mInput.val("");
				this.cmdIndex = this.cmdHistory.length;
				break;
			default:
				break;
		}
	}.bind(this));

	$(document.body).mousemove(function (ev) {
		if(this.isDomDebugActivated){
			$("#uniqueInfo").css("display", "block")
			$("#uniqueInfo").text($(ev.target).clone().children().remove().end()[0].outerHTML)
			$("#uniqueInfo").css("top", ev.clientY - 5)
			$("#uniqueInfo").css("left", ev.clientX)
		}
	}.bind(this))
};

Console.prototype.toggleVisibility = function () {
	var classList = $("#console").attr("class")
	classList = classList.split(" ")

	var isVisible = false
	if ($.inArray("invisible", classList) == -1) {
		isVisible = true
	}

	if (isVisible) {
		$("#console").addClass("invisible")
		$(this.mInput).blur()
	} else {
		$("#console").removeClass("invisible")
		$(this.mInput).focus()
	}
};

Console.prototype.toggleDomDebug = function () {
	this.isDomDebugActivated = !this.isDomDebugActivated
	console.log("Toggle DOM Debug : " + this.isDomDebugActivated)
	if(!this.isDomDebugActivated) $("#uniqueInfo").css("display", "none")
}

Console.prototype.log = function (msg) {
	var elem = $("<div class=message style='color:white'></div>")
	$(elem).text(msg)
	this.mLogContainer.append(elem);
	this.scrollableContainer.scrollListToElement(elem)
}

Console.prototype.info = function (msg) {
	var elem = $("<div class=message style='color:gray'></div>")
	$(elem).text(msg)
	this.mLogContainer.append(elem);
	this.scrollableContainer.scrollListToElement(elem)
}

Console.prototype.error = function (msg) {
	var elem = $("<div class=message style='color:red'></div>")
	$(elem).text(msg)
	this.mLogContainer.append(elem);
	this.scrollableContainer.scrollListToElement(elem)
}

Console.prototype.warn = function (msg) {
	var elem = $("<div class=message style='color:yellow'></div>")
	$(elem).text(msg)
	this.mLogContainer.append(elem);
	this.scrollableContainer.scrollListToElement(elem)
}

Console.prototype.debug = function (msg) {
	var elem = $("<div class=message style='color:white'></div>")
	$(elem).text(msg)
	this.mLogContainer.append(elem);
	this.scrollableContainer.scrollListToElement(elem)
}

window.clear = function () {
	$(".message").remove()
}

window.elementCount = function () {
	return $("*").length
}

registerScreen("Console", new Console());

function keyCodeToString(keyCode) {
	const keyMap = {
		8: "Backspace",
		9: "Tab",
		13: "Enter",
		16: "Shift",
		17: "Ctrl",
		18: "Alt",
		19: "Pause/Break",
		20: "Caps Lock",
		27: "Escape",
		32: "Space",
		33: "Page Up",
		34: "Page Down",
		35: "End",
		36: "Home",
		37: "Left Arrow",
		38: "Up Arrow",
		39: "Right Arrow",
		40: "Down Arrow",
		45: "Insert",
		46: "Delete",
		48: "0",
		49: "1",
		50: "2",
		51: "3",
		52: "4",
		53: "5",
		54: "6",
		55: "7",
		56: "8",
		57: "9",
		65: "A",
		66: "B",
		67: "C",
		68: "D",
		69: "E",
		70: "F",
		71: "G",
		72: "H",
		73: "I",
		74: "J",
		75: "K",
		76: "L",
		77: "M",
		78: "N",
		79: "O",
		80: "P",
		81: "Q",
		82: "R",
		83: "S",
		84: "T",
		85: "U",
		86: "V",
		87: "W",
		88: "X",
		89: "Y",
		90: "Z",
		91: "Left Window Key",
		92: "Right Window Key",
		93: "Select Key",
		96: "Numpad 0",
		97: "Numpad 1",
		98: "Numpad 2",
		99: "Numpad 3",
		100: "Numpad 4",
		101: "Numpad 5",
		102: "Numpad 6",
		103: "Numpad 7",
		104: "Numpad 8",
		105: "Numpad 9",
		106: "Multiply",
		107: "Add",
		109: "Subtract",
		110: "Decimal Point",
		111: "Divide",
		112: "F1",
		113: "F2",
		114: "F3",
		115: "F4",
		116: "F5",
		117: "F6",
		118: "F7",
		119: "F8",
		120: "F9",
		121: "F10",
		122: "F11",
		123: "F12",
		144: "Num Lock",
		145: "Scroll Lock",
		186: "Semi-colon",
		187: "Equal Signe",
		188: "Comma",
		189: "Dash",
		190: "Period",
		191: "Forward Slash",
		192: "Grave Accent",
		219: "Open Bracket",
		220: "Back Slash",
		221: "Close Bracket",
		222: "Single Quote"
	};

	if (keyMap.hasOwnProperty(keyCode)) {
		return keyMap[keyCode];
	} else {
		return "Unknown Key";
	}
}