/* Logo Functions module
 * Author: Tymoteusz Paszun
 *
 */

const NODE_FN = 0;
const NODE_VAL = 1;

const FN_USERDEF = 0;
const FN_BUILTIN = 1;

var InvalidInputType = function(input) {
	var err = new Error('INVALID_INPUT_TYPE');
	err.invalidInput = input;
	throw err;
}

var FunctionDefinition = new Class( {
	fnType: null,

	name: null,

	argc: null,

	execFun: null,

	initialize: function(name, argc, fnType, body) {
		this.name = name;
		this.argc = argc;
		this.fnType = fnType;

		switch (this.fnType) {
			case FN_USERDEF:
				break;
			case FN_BUILTIN:
				this.execFun = body;
				break;
		}

	}
} );

var FunctionContainer = new Class({

	items: null,

	initialize: function() {
		this.items = new Object();
	},

	add: function (definition) {
		this.items[definition.name] = definition;
	},

	addBuiltIn: function(builtIn) {
		for(func in builtIn) {
			this.add(builtIn[func]);
		}
		
	}
});

var BuiltInFunctions = {
	forward: new FunctionDefinition( 'forward', 1, FN_BUILTIN,
	function (inputs) {
		turtleConsole.forward(inputs[0].asNumber());
	} ),

	back: new FunctionDefinition( 'back', 1, FN_BUILTIN,
	function (inputs) {
		turtleConsole.back(inputs[0].asNumber());
	} ),

	left: new FunctionDefinition( 'left', 1, FN_BUILTIN,
	function (inputs) {
		turtleConsole.left(inputs[0].asNumber());
	} ),

	right: new FunctionDefinition( 'right', 1, FN_BUILTIN,
	function (inputs) {
		turtleConsole.right(inputs[0].asNumber());		
	} ),

	home: new FunctionDefinition( 'home', 0, FN_BUILTIN,
	function (inputs) {
		turtleConsole.home();
	} ),

	clean: new FunctionDefinition( 'clean', 0, FN_BUILTIN,
	function (inputs) {
		turtleConsole.clean();
	} ),

	clearscreen: new FunctionDefinition( 'clearscreen', 0, FN_BUILTIN,
	function (inputs) {
		turtleConsole.clean();
		turtleConsole.home();
	} ),

	print: new FunctionDefinition( 'print', 1, FN_BUILTIN, 
	function (inputs) {
		var tmpListStr;

		switch (inputs[0].valType) {
			case VAL_WORD: case VAL_NUM:
				logoConsole.println(inputs[0].asString());
				break;
			case VAL_LIST:
				tmpListStr = inputs[0].asString();
				tmpListStr = tmpList.substring(1, tmpList.length - 1); // trim list string from outher parentheses
				logoConsole.println( tmpListStr );
				break;
		}
	} ),

	help: new FunctionDefinition( 'help', 0, FN_BUILTIN,
	function (inputs) {
		logoConsole.println('There are available following commands (with number of inputs):');
		for(var fun in funContainer.items) {
			if (funContainer.items.hasOwnProperty(fun)) {
				logoConsole.println(funContainer.items[fun].name + ' (' + funContainer.items[fun].argc + ')');
			}
		}
	} ),

	sum: new FunctionDefinition( 'sum', 2, FN_BUILTIN, 
	function (inputs) {
		return new Value(VAL_NUM, inputs[0].asNumber() + inputs[1].asNumber());
	} ),

	difference: new FunctionDefinition( 'difference', 2, FN_BUILTIN, 
	function (inputs) {
		return new Value(VAL_NUM, inputs[0].asNumber() - inputs[1].asNumber());
	} ),

	product: new FunctionDefinition( 'product', 2, FN_BUILTIN, 
	function (inputs) {
		return new Value(VAL_NUM, inputs[0].asNumber() * inputs[1].asNumber());
	} ),

	quotient: new FunctionDefinition( 'quotient', 2, FN_BUILTIN, 
	function (inputs) {
		return new Value(VAL_NUM, inputs[0].asNumber() / inputs[1].asNumber());
	} ),

	make: new FunctionDefinition( 'make', 2, FN_BUILTIN, 
	function (inputs) {
		if (inputs[0].valType == VAL_LIST) {
			InvalidInputType(inputs[0]);	
		}

		varContainer.addOrSetVar(inputs[0].asString(), inputs[1]);
	} ),

	thing: new FunctionDefinition( 'thing', 1, FN_BUILTIN, 
	function (inputs) {
		var tmpVal;
		if (inputs[0].valType == VAL_LIST) {
			InvalidInputType(inputs[0]);
		}

		tmpVal = varContainer.getVar(inputs[0].asString());
		if (tmpVal === undefined) {
			throw new Error(inputs[0].asString() + ' has no value');
		}
		return tmpVal;
	} ),

	run: new FunctionDefinition( 'run', 1, FN_BUILTIN, 
	function (inputs) {
		var localParser,
			listToParse;

		if ( inputs[0].valType != VAL_LIST ) {
			InvalidInputType(inputs[0]);
		}

		listToParse = inputs[0].asString(); // get commands to execute
		listToParse = listToParse.substring(1, listToParse.length - 1); // delete outher parentheses

		localParser = prepareParser(); // create new parser

		localParser.parse( listToParse );

		interpretersStack.popInterpreter();
	} ),

	repeat: new FunctionDefinition( 'repeat', 2, FN_BUILTIN, 
	function (inputs) {
		var localParser,
			listToParse;

		var accumulator = 0,
			tmpNum;

		tmpNum = inputs[0].asNumber();

		if ( inputs[1].valType != VAL_LIST ) {
			InvalidInputType(inputs[1]);
		}

		listToParse = inputs[1].asString(); // get commands to execute
		listToParse = listToParse.substring(1, listToParse.length - 1); // delete outher parentheses

		localParser = prepareParser(); // create new parser

		for(var i = 0; i < tmpNum; i++) {
			localParser.parse( listToParse );
		}

		interpretersStack.popInterpreter();
	} ),

	type: new FunctionDefinition( 'type', 1, FN_BUILTIN, 
	function (inputs) {
		var tmpListStr;

		switch (inputs[0].valType) {
			case VAL_WORD: case VAL_NUM:
				logoConsole.typeText(inputs[0].asString());
				break;
			case VAL_LIST:
				tmpListStr = inputs[0].asString();
				tmpListStr = tmpListStr.substring(1, tmpListStr.length - 1); // trim list string from outher parentheses
				logoConsole.typeText( tmpListStr );
				break;
		}
	} ),

	flush: new FunctionDefinition( 'flush', 0, FN_BUILTIN, 
	function (inputs) {
		logoConsole.flushText();
	} ),

	random: new FunctionDefinition( 'random', 1, FN_BUILTIN, 
	function (inputs) {
		var tmpNum = inputs[0].asNumber();
		
		if (tmpNum == null) {
			InvalidInputType(inputs[0]);
		}

		return new Value( VAL_NUM, Math.floor( Math.random() * tmpNum ) );

	} ),	

}

var FunctionExecutor = new Class({

	fnContainer: null,
	
	initialize: function(fnContainer) {
		this.fnContainer = fnContainer;
	},

	execute: function(fnName, arguments) {
		var fnRetVal;
		var fnDef = this.fnContainer.items[fnName];
		
		// Check if input length matches function's argument count
		if (fnDef.argc != arguments.length)
			throw new Error('INVALID_ARGUMENT_COUNT');

		switch (fnDef.fnType) {
			case FN_USERDEF:
				break;

			case FN_BUILTIN:
				fnRetVal = fnDef.execFun(arguments);
				break;
		}

		return fnRetVal;
	}
})

var funContainer = new FunctionContainer();
funContainer.addBuiltIn(BuiltInFunctions);

var funExecutor = new FunctionExecutor(funContainer);