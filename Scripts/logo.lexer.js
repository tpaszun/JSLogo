var Lexer = (function () {
    
    var public = {};

    var TokenList = [];

    public.getTokenList = function () {
        return TokenList;
    };

    function validChar(char) {
        if (typeof(char) !== 'string' || char.length !== 1)
            throw new Error("validChar(char) expects that char will be single character string (typeof(char) == " + typeof(char) + ")");
    };

    function isWhitespace(char) {
        var c = char.charCodeAt(0);
        return (c === 32) || (c === 13) || (c === 9);
    };

    var bigStart = "A".charCodeAt(0), bigEnd = "Z".charCodeAt(0),
        smallStart = "a".charCodeAt(0), smallEnd = "z".charCodeAt(0),
        digitStart = "0".charCodeAt(0), digitEnd = "9".charCodeAt(0);

    function isDigit(char) {
        var c = char.charCodeAt(0);
        return c >= digitStart && c <= digitEnd 
    };

    function isLetter(char) {
        //return !(isWhitespace(char) || isDigit(char))
        var c = char.charCodeAt(0);
        return ( c >= bigStart && c <= bigEnd ) || ( c >= smallStart && c <= smallEnd )
    };

    var ST_IDLE = 0,
        ST_IDENT = 1,
        ST_NUMBER = 2,
        ST_WORD = 3,
        ST_THING = 4,
        ST_COMMENT = 5;
        ST_END = -1;

    var C_EOF = -1,
        C_WHITESPACE = 0,
        C_DIGIT = 1,
        C_LETTER = 2,
        C_QUOTE         = 0x22, // "
        C_PAREN_L       = 0x28, // (
        C_PAREN_R       = 0x29, // )
        C_COLON         = 0x3A, // :
        C_SEMICOLON     = 0x3B, // ;
        C_S_BRACKET_L   = 0x5B, // [
        C_S_BRACKET_R   = 0x5D, // ]
        // C_C_BRACKET_L   = 0x7B, // {
        // C_C_BRACKET_R   = 0x7D, // }
        C_EOL = 6;

    var TYPES = [];
    TYPES[ST_IDENT]         = Token.T_IDENTIFIER;
    TYPES[ST_NUMBER]        = Token.T_NUMBER;
    TYPES[ST_WORD]          = Token.T_WORD;
    TYPES[ST_THING]         = Token.T_THING;
    TYPES[C_PAREN_L]        = Token.T_OPEN_PAREN;
    TYPES[C_PAREN_R]        = Token.T_CLOSE_PAREN;
    TYPES[C_S_BRACKET_L]    = Token.T_OPEN_LIST;
    TYPES[C_S_BRACKET_R]    = Token.T_CLOSE_LIST;

    var Input = (function() {
        var inputText = '';
        var inputLength = 0;
        var currCharIdx = 0;

        function topChar() {
            if (currCharIdx == inputLength)
                return 'EOF';
            else
                return inputText[currCharIdx];
        }

        function topCharType() {
            var c = topChar();
            if (c === "EOF")
                return C_EOF;
            validChar(c);
            if (isWhitespace(c))
                return C_WHITESPACE;
            if (c === '\n')
                return C_EOL;
            if (isDigit(c))
                return C_DIGIT;
            if (c === '"')
                return C_QUOTE;
            if (c === ':')
                return C_COLON;
            if (c === ';')
                return C_SEMICOLON;
            if (c === '[')
                return C_S_BRACKET_L;
            if (c === ']')
                return C_S_BRACKET_R;
            if (isLetter(c))
                return C_LETTER;
            throw new Error("UNKNOWN CHAR TYPE (charCode: " + c.charCodeAt(0) + ")");   
        }

        return {
            setInputText: function (input) {
                inputText = input;
                inputLength = input.length;
                currCharIdx = 0;
            },

            length: function () { return inputLength; },
            
            popChar: function () {
                var c = topChar();
                if (currCharIdx < inputLength)
                    currCharIdx++;
                return c;
            },

            topChar: topChar,

            topCharType: topCharType,
            
            currIdx: function () { return currCharIdx; },

            text: function () { return inputText; }
        };
    })();

    var TokenValue = (function(){
        var buffer = "";

        function putChar(c) {
            buffer = buffer + c;
        };

        function getTokenValue() {
            return buffer;
        };

        function clear() {
            buffer = "";
        }

        return {
            putChar: putChar,
            getTokenValue: getTokenValue,
            clear: clear
        };
    })();


    public.lex = function (input) {

        function CompleteToken(c_type) {
            if (typeof(c_type) === 'undefined')
                TokenList.push(Token.Create(TYPES[state], TokenValue.getTokenValue()));
            else
                TokenList.push(Token.Create(TYPES[c_type], TokenValue.getTokenValue()));
            TokenValue.clear();
            state = ST_IDLE;
        };

        function Expects() {
            switch (state) {
                case ST_IDLE:
                    return "ANY CHAR"
                case ST_NUMBER:
                    return "DIGIT";
                case ST_IDENT:
                    return "LETTER";
            }
        };

        function UnexpectedToken() {
            var msg = '';
            
            for(var i = 0; i < Input.currIdx(); i++)
                msg = msg + '-';
            msg = msg + '^';

            msg = "UNEXPECTED SYMBOL (CHAR: '" + Input.topChar() + "' CHARCODE: " + Input.topChar().charCodeAt(0) + "), EXPECTED " + Expects() + ", AT:" + "\n" + Input.text() + "\n" + msg;
            console.log(msg);
            
            throw new Error(msg);
        };

        var state = ST_IDLE;
        Input.setInputText(input);
        TokenList = [];

        while (true) {
            switch (state) {
                case ST_END:
                    console.log("Finished!");
                    return TokenList;
                case ST_IDLE:
                    switch (Input.topCharType()) {
                        case C_EOF:
                            state = ST_END;
                            break;
                        case C_WHITESPACE:
                        case C_EOL:
                            Input.popChar();
                            break;
                        case C_DIGIT:
                            TokenValue.putChar(Input.popChar());
                            state = ST_NUMBER;
                            break;
                        case C_QUOTE:
                            TokenValue.putChar(Input.popChar());
                            state = ST_WORD;
                            break;
                        case C_COLON:
                            TokenValue.putChar(Input.popChar());
                            state = ST_THING;
                            break;
                        case C_SEMICOLON:
                            Input.popChar();
                            state = ST_COMMENT;
                            break;
                        case C_LETTER:
                            TokenValue.putChar(Input.popChar());
                            state = ST_IDENT;
                            break;
                        case C_S_BRACKET_L:
                        case C_S_BRACKET_R:
                            CompleteToken(Input.topCharType());
                            Input.popChar();
                            break;
                        default:
                            UnexpectedToken();
                    };
                    break;
                case ST_COMMENT:
                    switch (Input.topCharType()) {
                        case C_EOL:
                            state = ST_IDLE;
                            Input.popChar();
                            break;
                        default:
                            Input.popChar();
                            break;
                    }
                    break;
                case ST_NUMBER:
                    switch (Input.topCharType()) {
                        case C_EOF:
                        case C_WHITESPACE:
                        case C_EOL:
                        case C_QUOTE:
                        case C_COLON:
                        case C_SEMICOLON:
                        case C_S_BRACKET_L:
                        case C_S_BRACKET_R:
                            CompleteToken();
                            break;
                        case C_DIGIT:
                            TokenValue.putChar(Input.popChar());
                            break;
                        default:
                            UnexpectedToken();
                    }
                    break;
                case ST_WORD:
                case ST_THING:
                case ST_IDENT:
                    switch (Input.topCharType()) {
                        case C_EOF:
                        case C_WHITESPACE:
                        case C_EOL:
                        case C_S_BRACKET_L:
                        case C_S_BRACKET_R:
                            CompleteToken();
                            break;
                        case C_QUOTE:
                        case C_COLON:
                        case C_SEMICOLON:
                        case C_LETTER:
                        case C_DIGIT:
                            TokenValue.putChar(Input.popChar());
                            break;
                        default:
                            UnexpectedToken();
                    }
                    break;
            };
        }
    }

    // Public
    return public;
})();
