/* Logo Variables module
 * Author: Tymoteusz Paszun
 *
 */

var VariableDefinition = new Class( {

	value: null,

	initialize: function(value) {
		this.valType = valueType;
	}
	
} );

var VariableContainer = new Class( {

	items: null,

	initialize: function () {
		this.items = new Object();
	},

	addOrSetVar: function (name, value) {
		this.items[name] = value;
	},

	getVar: function(name) {
		return this.items[name];
	}

} );

var varContainer = new VariableContainer();