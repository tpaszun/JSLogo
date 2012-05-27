var ExecutionManager = (function() {
	var public = {};

	public.execute = function (text) {
		var Tokens = Lexer.lex(text);

		for(var tok in Tokens) {
			switch (Tokens[tok].type) {
				case Token.T_OPEN_LIST:
					interpretersStack.getTopInterpreter().openList();
					break;
				case Token.T_CLOSE_LIST:
					interpretersStack.getTopInterpreter().closeList();
					break;
				case Token.T_IDENTIFIER:
					interpretersStack.getTopInterpreter().addNode(IDENTIFIER, Tokens[tok].value);
					break;
				case Token.T_NUMBER:
					interpretersStack.getTopInterpreter().addNode(NUMBER, Tokens[tok].value);
					break;
				case Token.T_WORD:
					interpretersStack.getTopInterpreter().addNode(WORD, Tokens[tok].value);
					break;
				case Token.T_THING:
					interpretersStack.getTopInterpreter().addNode(THING, Tokens[tok].value);
					break;
			}
		}
	}

	return public;
})();