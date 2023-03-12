# **Battle Brothers Console**
This repos contain a mod for Battle Brothers enabling a console to help debuging the interfaces.

![This is an image](./readme/img.png)

## **Why this mod ?**
A [Dev Console](https://www.nexusmods.com/battlebrothers/mods/380?tab=posts) mod already exist but do not respond to my need which is having an equivalant to the google chrome console (more or less). This is why I've done this mod as I can't find a Github repository for [Dev Console](https://www.nexusmods.com/battlebrothers/mods/380?tab=posts) where I can provide a pull request. The solution to my need are listed below in functionality part.

## **Functionality**
- Pressing Tab to toggle console visibility at any moment (in menu or in game).
- When pressing enter, the Input in the console is executed with the [eval()](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/eval) JavaScript function. So you basicaly can't execute Squirrel code directly. You will have to create a connection between JavaScript and Squirrel before in your own mod.
- Pressing ALT toggle DOM debug which create a tooltips containing the Id and the class of the current hovered HTML element in this format : `#[id] .[class]`.
- Customize some keys related to console mod in Mod Options menu.
- Arrow up and down when the console input is focused to retreive previous commands.
- In Squirrel add a global `::Console` which can be used like this `::Console.log("test")` to log to the console that you can see in the upper screenshot.

## **Dependencies**
- [Modding Standards and Utilities (MSU)](https://www.nexusmods.com/battlebrothers/mods/479)
- [Modding script hooks](https://www.nexusmods.com/battlebrothers/mods/42)

## **FAQ**
### **How to execute Squirrel code from JavaScript ?**

The game is devided in 2 languages, Javascript for the UI and Squirrel for the Logic. The Logic can update the UI, for example when a Brother take a hit we update the lifebar, aswell as the UI can update the Logic, for example when you change the equipement of a Brother we update his defensive stats. So we have two bridge :
- Javascript -> Squirrel
- Squirrel -> Javascript

To understand how it's work, a simple example is how I've done the `::Console` global variable, log to the console. Here my JavaScript class Console which is simplified for the understanding purpose.

```js
var Console = function () {
    //This variable will contain ur bridge JavaScript -> Squirrel.
	this.mSQHandle = null
	this.mID = "Console";
}

Console.prototype.onConnection = function (_handle) {
	this.create($('.root-screen'));
	this.mSQHandle = _handle;

    //I don't use mSQHandle in this version of Console mod so here an example on how to use it. SQ is defined globaly and exist in the current context. The first parameter is ur bridge, the second the Squirrel function to call, the third an array with the parameters for this squirrel function and finally the callback which is called after executing the desired Squirrel function.
    SQ.call(this.mSQHandle, 'functionToCall', [param1, param2, ...], callback);
}

Console.prototype.create = function (_parentDiv) {
    //create the console HTMLElement (setup the UI)
};

Console.prototype.toggleVisibility = function () {
    //display/hide the console
};

Console.prototype.toggleDomDebug = function () {
    //display/hide the DOM debug mod
}

Console.prototype.log = function (msg) {
    //display a log in the console
}

Console.prototype.info = function (msg) {
    //display an info in the console
}

Console.prototype.error = function (msg) {
    //display an error in the console
}

Console.prototype.warn = function (msg) {
    //display a warn in the console
}

Console.prototype.debug = function (msg) {
    //display a debug in the console
}

//Will register Console class with as ID: "Console". This ID will be used SQuirrel side to create a bridge SQuirrel -> JavaScript
registerScreen("Console", new Console());
```

As we can see, we don't use bridge in this JavaScript code, but the important part is that we register the Console class with the "Console" ID. Now let's take a look at the Squirrel class Console which we want to make communicate with ur JavaScript Console class.

```js
this.console <- {
	ID = "mod_console",
	Version = "1.0.0",
	Name = "Console",

	m = {
        //This variable will contain ur bridge SQuirrel -> JavaScript
		JSHandle = null,
	}

	function connect()
	{
        //We connect "fetch" ur JavaScript class Console which have the id Console (first parameter) and put it in JSHandle
		this.m.JSHandle = ::UI.connect("Console", this);
	}

	function toggleVisibility()
	{
        //From now on we can call ur javascript class using JSHandle.
		this.m.JSHandle.asyncCall("toggleVisibility","");
	}

	function toggleDomDebug()
	{
		this.m.JSHandle.asyncCall("toggleDomDebug","");
	}

	function log(msg) {
		this.m.JSHandle.asyncCall("log",msg);
	}

    function info(msg) {
		this.m.JSHandle.asyncCall("info",msg);
    }

    function debug(msg) {
		this.m.JSHandle.asyncCall("debug",msg);
    }

    function error(msg) {
		this.m.JSHandle.asyncCall("error",msg);
    }

    function warn(msg) {
		this.m.JSHandle.asyncCall("warn",msg);
    }
};
```
You can now use Squirrel Console class to log in the UI.