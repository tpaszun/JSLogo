/* JSLogo Values module
 * Author: Tymoteusz Paszun
 *
 */

const VAL_WORD = 0;
const VAL_NUM = 1;
const VAL_LIST = 2;

const VAL_BOOL = 3;

var Value = new Class( {
	valType: null,

	val: null,

	initialize: function(type, val) {
		this.valType = type;

		if (this.valType == VAL_LIST) {
			this.val = new Array();
		} else {
			this.val = val;
		}
		// if ( (this.valType == VAL_WORD) && (this.val[0] == '"') ) // trim '"' character
		// 	this.val = this.val.substring(1, this.val.length);
			
	},

	asString: function() {
		var retStr;

		switch (this.valType) {
			case VAL_WORD:
				return this.val;
				break;
			case VAL_NUM:
				return Number(this.val).toString();
				break;
			case VAL_LIST:
				retStr = '[';
				for(var i = 0; i < this.val.length; i++) {
					retStr += this.val[i].asString() + ' ';
				}
				if (this.val.length > 0) { // if contains anything
					retStr = retStr.substring(0, retStr.length-1); // trim last ' '
				}
				retStr += ']';
				return retStr;
				break;
			case VAL_BOOL:
				return this.val?'true':'false';
				break;
		}
	},

	isNumber: function () {
		return (this.valType == VAL_NUM) || ((this.valType == VAL_WORD) && (!isNaN(Number(this.val))));
	},

	asNumber: function() {
		var err;

		if ( this.isNumber() ) {
			return Number(this.val);
		}
		else {
			err = new Error('INVALID_INPUT_TYPE');
			err.invalidInput = this;
			throw err;
		}

/*		switch (this.valType) {
			case VAL_WORD:
				value = Number(this.val);
				if (!isNaN(value)) {
					return value;
				}
				break;
			case VAL_NUM:
				return this.val;
				break;
			case VAL_LIST:
				break;
		}
*/
	},

	isBoolean: function() {
		return (this.valType == VAL_BOOL) || ((this.valType == VAL_WORD) && ( (this.val.toLowerCase() == "true") || (this.val.toLowerCase() == "false") ));
	},

	asBoolean: function() {
		var err;

		if ( this.isBoolean() ) {
			switch (this.valType) {
				case VAL_BOOL:
					return this.val;
					break;
				case VAL_WORD:
					if (this.val.toLowerCase() == "true") {
						return true;
						break;
					} 
					else if (this.val.toLowerCase() == "false") {
						return false;
						break;
					}
					else {
						err = new Error('INVALID_INPUT_TYPE');
						err.invalidInput = this;
						throw err;
					}
			}
		}
		else {
			err = new Error('INVALID_INPUT_TYPE');
			err.invalidInput = this;
			throw err;
		}
	}

} );