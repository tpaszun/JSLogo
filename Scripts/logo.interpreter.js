/* Logo Interpreter module
 * Author: Tymoteusz Paszun
 *
 */

 const IDENTIFIER = 0;
 const WORD = 1;
 const THING = 2;
 const NUMBER = 3;

 const ST_INTERPRET = 0;
 const ST_ENTER_LIST = 1;

 var FunctionStackElement = new Class( {
 	name: null,

 	inputs: null,

 	expectedInputsCount: null,

 	initialize: function(name) {
 		this.name = name;
 		this.inputs = new Array();
 		this.expectedInputsCount = funContainer.items[name.toLowerCase()].argc;
 	}

 } );

 var Interpreter = new Class( {
 	funStack: null,

 	funStackTop: null,

 	listStack: null,

 	listStackTop: null,

 	state: null,

 	initialize: function() {
 		this.funStack = new Array();
 		this.listStack = new Array();

 		this.state = ST_INTERPRET;
 	},

 	updateFunStackTop: function() {
 		var topIdx;

 		topIdx = this.funStack.length - 1;
 		if (topIdx >= 0) {
			this.funStackTop = this.funStack[topIdx];	
		} else {
			this.funStackTop = null;
		}
 	},

 	updateListStackTop: function() {
 		var topIdx;

 		topIdx = this.listStack.length - 1;
 		if (topIdx >= 0) {
			this.listStackTop = this.listStack[topIdx];	
		} else {
			this.listStackTop = null;
		}
 	},

 	putValueOnCallStackTopInput: function(value) {
 		if (this.funStackTop === null) {
 			throw Error("You don't say what to do with " + value.asString() );
 		}

 		this.funStackTop.inputs.push(value);
 	},


 	addNode: function(type, identifier) {

 		if (this.state == ST_ENTER_LIST) { // List enter state
 			switch (type) {
				case IDENTIFIER:
					this.listStackTop.val.push(new Value(VAL_WORD, identifier));
					break;
				case WORD: 
					this.listStackTop.val.push(new Value(VAL_WORD, identifier));
					break;
				case THING:
					this.listStackTop.val.push(new Value(VAL_WORD, identifier));
					break;
				case NUMBER:
					this.listStackTop.val.push( new Value(VAL_NUM, parseFloat(identifier)) );
					break;
			};
 		}
 		else if (this.state == ST_INTERPRET) { // Interpret state
			switch (type) {
				case IDENTIFIER:
					if ( funContainer.items[identifier.toLowerCase()] == undefined ) {
						throw new Error("I don't know how to " + identifier);
					}
					this.funStack.push( new FunctionStackElement(identifier) );
					this.updateFunStackTop();
					break;
				case WORD: 
					this.putValueOnCallStackTopInput( new Value(VAL_WORD, identifier.substring(1, identifier.length)) );
					break;
				case THING:
					this.funStack.push( new FunctionStackElement('thing') );
					this.updateFunStackTop();
					this.putValueOnCallStackTopInput( new Value(VAL_WORD, identifier.substring(1, identifier.length)) );
					break;
				case NUMBER:
					this.putValueOnCallStackTopInput( new Value(VAL_NUM, parseFloat(identifier)) );
					break;
			}

			this.tryToExecute();
 		}

	},

	tryToExecute: function() {
		var fnRetVal,
 			execFunName;

		while ( (this.funStackTop !== null) && (this.funStackTop.inputs.length == this.funStackTop.expectedInputsCount) ) {
			execFunName = this.funStackTop.name; // cache executed function name - in case it's needed to report error
			try {
				fnRetVal = funExecutor.execute(this.funStackTop.name.toLowerCase(), this.funStackTop.inputs);
			}
			catch(err) {
				if (err.message == 'INVALID_INPUT_TYPE') {
					throw new Error( this.funStackTop.name + " doesn't like " + err.invalidInput.asString() + " as input");
				}
				else {
					throw err;
				}
			}
			this.funStack.pop(); // pop executed function from call stack
			this.updateFunStackTop();

			if ( fnRetVal !== undefined ) { // executed function returned a value
				this.putValueOnCallStackTopInput(fnRetVal); // put returned value on call stack top's input

			} else { // executed function didn't return any value
				if ( this.funStack.length > 0 ) { // if there is function waiting for the input
					throw Error( execFunName + " didin't output to " + this.funStackTop.name );
				}
			}

		}
	},

	endInput: function() {
		if (this.state == ST_INTERPRET) {
			if (this.funStackTop !== null) {
				this.funStack.length = 0;
				throw new Error("not enough inputs to " + this.funStackTop.name);
			}
		}
		else if (this.state == ST_ENTER_LIST) {
			
		}
	},

	clearStack: function() {
		this.funStack.length = 0;
	},

	openList: function() {
		this.listStack.push( new Value(VAL_LIST) );
		this.updateListStackTop();

		this.setEnterListState();
	},

	closeList: function() {
		var list;

		if (this.listStackTop === null) { // unexpected ']'
			throw new Error("unexpected ']'");
		}

		list = this.listStack.pop();

		this.updateListStackTop();

		if (this.listStackTop === null) { // if there is no other opened list
			this.setInterpretState();
			this.putValueOnCallStackTopInput(list); // try to return to command input
			this.tryToExecute();
		}
		else { // if there is another opened list
			this.listStackTop.val.push(list);
		}
	},
	
	setInterpretState: function() {
		this.state = ST_INTERPRET;

		logoConsole.changeCommandPrompt('?');
	},

	setEnterListState: function() {
		this.state = ST_ENTER_LIST;
		
		logoConsole.changeCommandPrompt('~');
	}

 } );

  // var interpreter = new Interpreter();