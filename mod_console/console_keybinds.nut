::Console.Mod.Keybinds.addSQKeybind("ToggleConsole", "tab", ::MSU.Key.State.All, function() {
	::Console.toggleVisibility()
}, "Toggle console");

::Console.Mod.Keybinds.addSQKeybind("ToggleDomDebug", "alt", ::MSU.Key.State.All, function() {
	::Console.toggleDomDebug()
}, "Toggle DOM debug");