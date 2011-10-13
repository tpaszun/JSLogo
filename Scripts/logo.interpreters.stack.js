/* Logo Interpreters stack module
 * Author: Tymoteusz Paszun
 *
 */

var InterpretersStack = new Class( {
	interpreters: null,

	initialize: function() {
		this.interpreters = new Array();

	},

	addInterpreter: function() {
		this.interpreters.push( new Interpreter() );
	},

	getTopInterpreter: function() {
		if (this.interpreters.length == 0) {
			throw new Error('INVALID ACCESS TO INTERPRETERS STACK - STACK IS EMPTY');
		}

		return this.interpreters[this.interpreters.length - 1];
	},

	popInterpreter: function() {
		this.interpreters.pop();		
	},

	clearToBottomInterpreter: function() {
		while ( this.interpreters.length > 1 ) {
			this.popInterpreter();
		}
	}
} );

var interpretersStack = new InterpretersStack();