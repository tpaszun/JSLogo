const NODE_FN = 0;
const NODE_VAL = 1;

var ASTNode = new Class({
	
	nodeType: null,

	value: null,

	children: null,

	initialize: function(nodeType, value) {
		switch(nodeType) {
			case NODE_VAL: 
				this.value = value;
				break;
			case NODE_FN:
				this.children = new Array();
				break;
			default:
				throw new Error("ASTNode.initialize: unknown nodeType!");
		}
		this.nodeType = nodeType;
	}
});


var ASTBuilder = new Class({
	rootNode: null,

	nodesStack: null,

	initialize: function() {
		this.nodesStack = new Array();
	}
});