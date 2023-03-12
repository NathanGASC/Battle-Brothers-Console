this.console <- {
	ID = "mod_console",
	Version = "1.0.0",
	Name = "Console",

	m = {
		JSHandle = null,
	}

	function connect()
	{
		this.m.JSHandle = ::UI.connect("Console", this);
	}

	function toggleVisibility()
	{
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