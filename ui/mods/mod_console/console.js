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
	this.domDebugIndex = 0;
	this.isVisible = false

	this.logs = []
	this.builderId = null

	this.elementToScrollTo = $("<div></div>")
}

Console.prototype.onConnection = function (_handle) {
	try {
		this.create($('.root-screen'));
		this.mSQHandle = _handle;

		window.console = this

		console.log("Console overwrited")
	} catch (e) {
		console.error(e.toString())
	}
}

Console.prototype.create = function (_parentDiv) {
	try {
		$('.root-screen').append($("<div id=uniqueInfo></div>"))

		this.mContainer = $('<div id="console" class="invisible"/>');
		_parentDiv.append(this.mContainer);

		this.logWrapper = $('<div id="logWrapper"/>');
		this.mContainer.append(this.logWrapper)
		this.scrollableContainer = this.logWrapper.createList(1, 'content-container')
		this.mLogContainer = this.logWrapper.findListScrollContainer();

		this.mInput = $('<input id=cmdInput type="text" class="text-font-small font-bold font-color-brother-name" placeholder="Type command..."></input>');
		this.mContainer.append(this.mInput)

		$(document.body).keyup(function (e) {
			var charFromMap = keyCodeToString(e.which)
			switch (charFromMap) {
				case "Up Arrow":
					if (!this.isDomDebugActivated) return;
					this.domDebugIndex++
					break;
				case "Down Arrow":
					if (!this.isDomDebugActivated || this.domDebugIndex == 0) return;
					this.domDebugIndex--
					break;
			}
		}.bind(this))

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
			if (this.isDomDebugActivated) {
				const elem = getParentByLevel(ev.target, this.domDebugIndex)
				$("#uniqueInfo").css("display", "block")
				$("#uniqueInfo").text(this.domDebugIndex + " : " + elem.outerHTML)
				$("#uniqueInfo").css("top", ev.clientY - 5)
				$("#uniqueInfo").css("left", ev.clientX)
			}
		}.bind(this))

		$(document.body).click(function (ev) {
			if (this.isDomDebugActivated) {
				const elem = getParentByLevel(ev.target, this.domDebugIndex)
			}
		}.bind(this))
	} catch (e) {
		console.error(e.toString())
	}
};

Console.prototype.toggleVisibility = function () {
	try {
		if (this.isVisible) {
			$("#console").addClass("invisible")
			$(this.mInput).blur()
			this.isVisible = false
			$(this.mLogContainer).text("")
		} else {
			$("#console").removeClass("invisible")
			$(this.mInput).focus()
			this.isVisible = true
			this.build()
		}
	} catch (e) {
		console.error(e)
	}
};

Console.prototype.toggleDomDebug = function () {
	try {
		this.isDomDebugActivated = !this.isDomDebugActivated
		if (!this.isDomDebugActivated) $("#uniqueInfo").css("display", "none")
		this.domDebugIndex = 0
		console.log("Toggle DOM Debug : " + this.isDomDebugActivated)
	} catch (e) {
		console.error(e)
	}
}

Console.prototype.log = function (msg) {
	try {
		this.addToLogs(this.msgTransform(msg), "log")
		this.build()
	} catch (e) {
		console.error(e)
	}

}

Console.prototype.info = function (msg) {
	try {
		this.addToLogs(this.msgTransform(msg), "info")
		this.build()
	} catch (e) {
		console.error(e)
	}
}

Console.prototype.error = function (msg) {
	try {
		this.addToLogs(this.msgTransform(msg), "error")
		this.build()
	} catch (e) {
		throw e
	}
}

Console.prototype.warn = function (msg) {
	try {
		this.addToLogs(this.msgTransform(msg), "warn")
		this.build()
	} catch (e) {
		console.error(e)
	}
}

Console.prototype.debug = function (msg) {
	try {
		this.addToLogs(this.msgTransform(msg), "debug")
		this.build()
	} catch (e) {
		console.error(e)
	}
}

Console.prototype.addToLogs = function (msg, type) {
	this.logs.push({
		type: type,
		msg: msg
	})
}

Console.prototype.msgTransform = function (msg) {
	//msg = msg.replace(/"/gm, "")
	return msg
}

Console.prototype.build = function () {
	if(this.builderId) clearTimeout(this.builderId);
	try {
		/**
		 * This setTimeout at 0 isn't meaningless. It fix a bug when logs happen while loading screen is up.
		 * The issue is probably related to the overload when loading screen is up and the browser can't keep
		 * up the display. Having a setTimeout to 0 for some reason, will skip those messages while overloaded.
		 * Not suere why to.
		 */
		this.builderId = setTimeout(function () {
			if (!this.isVisible) return;
			var logs = this.logs

			$(this.mLogContainer).html("")
			var lastLog = null
	
			logs.forEach(function (log) {
				if (lastLog && $(lastLog).attr('data-type') == log.type) {
					lastLog.html(lastLog.html() + "</br>" + log.msg)
				} else {
					lastLog = $("<div class='message' data-type='" + log.type + "'></div>")
					lastLog.html(log.msg)
					$(this.mLogContainer).append(lastLog)
				}
			}.bind(this))

			$(this.scrollableContainer).append(this.elementToScrollTo)
			$(this.scrollableContainer).scrollListToElement(this.elementToScrollTo)
			$(this.elementToScrollTo).remove()
		}.bind(this),0)
	} catch (e) {
		console.error(e)
	}
}

Console.prototype.clear = function () {
	try {
		$(this.mLogContainer).text("")
		this.logs = []
	} catch (e) {
		console.error(e)
	}
}

Console.prototype.testLimit = function (size) {
	try {
		for (var index = 0; index < size / 4; index++) {
			console.log(index)
			console.error(index)
			console.warn(index)
			console.debug(index)
		}
	} catch (e) {
		console.error(e)
	}

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

function escapeHTML(html) {
	return html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function getParentByLevel(element, level) {
	var parent = element;
	for (var i = 0; i < level; i++) {
		parent = parent.parentNode;
	}
	return parent;
}