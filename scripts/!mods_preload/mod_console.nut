::Console <- ::new("mod_console/console.nut");
::mods_registerJS("ui/console.js");
::mods_registerCSS("ui/css/console.css");

::mods_registerMod(::Console.ID, ::Console.Version "Display a console with logs");
::mods_queue(::Console.ID, ::MSU.ID, function()
{    
	::include("mod_console/setup_console_mod.nut");
	::include("mod_console/console_keybinds.nut");

    ::mods_hookExactClass("ui/screens/menu/modules/main_menu_module", function(o)
    {
        local connectBackend = o.connectBackend;

        local logInfo = ::logInfo
        ::logInfo <- function(msg) {
            logInfo(msg)
            ::Console.log(msg)
        }
        
        o.connectBackend <- function()
        {
            ::Console.connect();
            connectBackend()
        }
    });
});