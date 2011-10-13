%lex
%%
\s+						/* skip whitespace */
[\[]					return 'OPEN_LIST'
[\]]					return 'CLOSE_LIST'
[0-9]+("."[0-9]+)?\b	return 'NUMBER'
["][0-9a-zA-Z"."]+		return 'WORD'
[:][0-9a-zA-Z"."]+		return 'THING'
[a-zA-Z"."]+			return 'IDENTIFIER'
<<EOF>>					return 'EOF'
.						return 'INVALID'

/lex

%start expressions

%%

expressions
	: many EOF			{ interpretersStack.getTopInterpreter().endInput(); }
	;

many
	: single many		{ $$ = $1 + ' ' + $2; }
	| single			{ $$ = $1; }
	;

single
	: OPEN_LIST			{
							interpretersStack.getTopInterpreter().openList();
						}
	| CLOSE_LIST		{
							interpretersStack.getTopInterpreter().closeList();
						}
	| WORD				{
							$$ = '(' + num + ' WORD ' + $1 + ')';
							num++;
							interpretersStack.getTopInterpreter().addNode(WORD, $1);
						}
	| THING				{
							$$ = '(' + num + ' THING ' + $1 + ')';
							num++;
							interpretersStack.getTopInterpreter().addNode(THING, $1);
						}
	| IDENTIFIER		{
							$$ = '(' + num + ' IDENTIFIER ' + $1 + ')';
							num++;
							interpretersStack.getTopInterpreter().addNode(IDENTIFIER, $1);
						}
	| NUMBER			{
							$$ = '(' + num + ' NUMBER ' + $1 + ')';
							num++;
							interpretersStack.getTopInterpreter().addNode(NUMBER, $1);
						}
	;