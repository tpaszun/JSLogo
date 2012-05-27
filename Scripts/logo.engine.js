/* JSLogo General module
 * Author: Tymoteusz Paszun
 *
 */
const KEY_DOWN = 40;
const KEY_UP = 38;
const KEY_ESC = 27;

function OnDocumentLoad() {

	logoConsole = new Console('console');
	turtleConsole = new TurtleConsole('turtleCanvas');
	// turtleConsole.hide();
	turtleConsole.resize();

	document.onkeydown = function(event) {
		if (!event.ctrlKey && !event.altKey) {
			logoConsole.input.focus();
		} 
	}

	window.onresize = function() {
		turtleConsole.resize();
	}

	logoConsole.println("Welcome to Tim's Logo Interpreter version 0.1");
	logoConsole.println("\n");
	logoConsole.println("To show available commands please type 'help'");

}
