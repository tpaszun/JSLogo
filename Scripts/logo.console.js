/* Logo Console module
 * Author: Tymoteusz Paszun
 * 
 * Requires: 
 * - jsoo.js
 *
 * Usage:
 * logoConsole.println(text);
 */

/* Console class */
var Console = new Class( {
	container: null,
	
	output: null,

	input: null,

	commandPromptChar: '?',

	commandPrompt: null,

	history: null,

	currentHistId: null,

	buffer: '',

	initialize: function(elementName) {
		this.container = document.getElementById(elementName);
		this.output = document.getElementById('output');
		this.input = document.getElementById('input');
		this.commandPrompt = document.getElementById('command_prompt');

		this.input.console = this; // bind current console to input object (used to handle input events)

		this.history = new Array();

		this.input.onkeydown = this.inputOnKeyDown;
		
	},

	submit: function() {
		var text = this.input.value;

		if (text != '') {
			this.println(this.commandPromptChar + ' ' + text);

			try {
				parser.parse(text);	
			}
			catch (err) {
				this.logError(err.message);
				interpretersStack.clearToBottomInterpreter();
				interpretersStack.getTopInterpreter().clearStack();
				interpretersStack.getTopInterpreter().setInterpretState();
			}

			turtleConsole.redraw();

			this.addHist(text);
		}

		// if (this.currentHistId != null && text != this.history[this.currentHistId])
		this.currentHistId = null;

		this.input.value = '';
	},

	typeText: function(text) {
		this.buffer += text;
	},

	flushText: function() {
		this.println(this.buffer);
		this.buffer = '';
	},

	logError: function(msg) {
		this.println(msg, 'error');
	},

	println: function(text, className) {
		var newDiv = document.createElement('div');
		if (className !== undefined) {
			newDiv.className = className;
		}

		newDiv.innerHTML = text.replace(/\n/g, '<br/>');
		this.output.appendChild(newDiv);

		this.container.scrollTop = this.container.scrollHeight;
	},

	addHist: function(command) {
		this.history.push(command);
	},

	getPrevHist: function() {
		if (this.currentHistId == null) {
			if (this.history.length > 0) {
				this.currentHistId = this.history.length - 1;
			}
			else {
				return null;
			}
			
		}
		else {
			if (this.currentHistId > 0) {
				this.currentHistId--;
			}
		}

		return this.history[this.currentHistId];
	},

	getNextHist: function() {
		if (this.currentHistId != null) {
			if (this.currentHistId < this.history.length - 1) {
				this.currentHistId++;
				return this.history[this.currentHistId];
			}
			else
				return null;			
		}
		return null;
	},

	changeCommandPrompt: function(commandPrompt) {
		this.commandPromptChar = commandPrompt;
		this.commandPrompt.innerHTML = commandPrompt + '&nbsp;';		
	},

	inputOnKeyDown: function(e) {
		var code = e.keyCode;
		var histLine;
		var len;

		switch (code) {
			case KEY_UP: 
				histLine = this.console.getPrevHist(); // TODO: shouldn't be 'logoConsole'
				break;
			case KEY_DOWN:
				histLine = this.console.getNextHist(); // TODO: shouldn't be 'logoConsole'
				break;
//			case KEY_ESC:
//				this.value = '';
//				break;
		}
		if (histLine != null) {
			this.value = histLine;
			len = this.value.length * 2;
			this.selectionStart =len;
			this.selectionEnd = len;
		}
		
	}

} );

var logoConsole;