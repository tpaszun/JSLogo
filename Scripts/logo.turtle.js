/* Logo Turtle Graphics Console module
 * Author: Tymoteusz Paszun
 * 
 * Requires: 
 * - jsoo.js
 *
 * Usage:
 * turtleConsole.forward(10);
 * turtleConsole.hide();
 * turtleConsole.show();
 * etc.
 */

/* Vector 2D class */
var Vector2D = new Class( {
	x: 0,
	y: 0,

	initialize: function(x, y) {
		if (y === undefined) { // when passed only one argument - vector?
			this.x = x.x;
			this.y = x.y;
		} else {
			this.x = x;
			this.y = y;
		}
	},

	add: function(x, y) {
		if (y === undefined) { // when passed only one argument - vector?
			this.x += x.x;
			this.y += x.y;
		} else {
			this.x += x;
			this.y += y;
		}
	},

	rotate: function(angle) {
		var angleRad = angle * Math.PI / 180;
		var sinAngle = Math.sin(angleRad);
		var cosAngle = Math.cos(angleRad);
		var tmpX = this.x, tmpY = this.y;

		this.x = tmpX * cosAngle + tmpY * sinAngle;
		this.y = tmpY * cosAngle - tmpX * sinAngle;
	}
 	
} );

/* Console class */
var TurtleConsole = new Class({
	
	elementId: null,

	canvas: null,

	context: null,

	pos: null,

	angle: 0,
	angleRad: 0,
	sinAngle: 0,
	cosAngle: 1,

	turtlePoints: [
		new Vector2D(-5, -3),
		new Vector2D(0, 12),
		new Vector2D(5, -3)
	],

	path: null,

	needsRedraw: true,

	initialize: function(canvasTag) {

		this.canvas = document.getElementById(canvasTag);
		this.context = this.canvas.getContext('2d');

		this.pos = new Vector2D(0, 0);

		this.context.strokeStyle = '#FF0000';

		this.path = new Array();

	},

	addPathPoint: function(vector) {
		this.path.push( new Vector2D(vector) );
	},

	forward: function(length) {
		this.addPathPoint(this.pos); // add current position as line segment start
		this.pos.add(this.sinAngle * length, this.cosAngle * length); // update position vector
		this.addPathPoint(this.pos); // add current position as line segment end

		this.draw();
	},

	back: function(length) {
		this.addPathPoint(this.pos); // add current position as line segment start
		this.pos.add(-this.sinAngle * length, -this.cosAngle * length); // update position vector
		this.addPathPoint(this.pos); // add current position as line segment end

		this.draw();
	},

	left: function(angle) {
		this.angle = (this.angle - angle) % 360;
		this.updateAngle();

		this.draw();
	},

	right: function(angle) {
		this.angle = (this.angle + angle) % 360;
		this.updateAngle();

		this.draw();
	},

	home: function() {
		this.angle = 0;
		this.updateAngle();
		this.pos = new Vector2D(0,0);

		this.draw();
	},

	clean: function() {
		this.path.length = 0;

		this.draw();
	},

	updateAngle: function() {
		this.angleRad = this.angle * Math.PI / 180;
		this.sinAngle = Math.sin(this.angleRad);
		this.cosAngle = Math.cos(this.angleRad);
	},

	hide: function() {
		this.canvas.hidden = true;
	},

	show: function() {
		this.canvas.hidden = false;	
	},

	/* returns vector transformed to canvas coordinate system */
	transform: function(vec2d) {
		return new Vector2D( (this.canvas.width / 2 + vec2d.x), (this.canvas.height / 2 - vec2d.y) )
	},

	drawTurtle: function() {
		var points = new Array();

		for(var i = 0; i < this.turtlePoints.length; i++)
			points.push( new Vector2D( this.turtlePoints[i] ) );

		for(var i = 0; i < points.length; i++) {
			points[i].rotate(this.angle);
			points[i].add(this.pos);
			points[i] = this.transform(points[i]);
		}

		this.context.beginPath();
		this.context.moveTo( points[points.length - 1].x, points[points.length - 1].y );
		for(var i = 0; i < points.length; i++)
			this.context.lineTo( points[i].x, points[i].y );
		this.context.stroke();
	},

	drawPath: function() {
		var canvasPos;

		for(var i = 0; i < this.path.length; i = i + 2) {
			canvasPos = this.transform(this.path[i]); // get start point transformed to canvas coordinate system
			this.context.beginPath();
			this.context.moveTo( canvasPos.x, canvasPos.y );
			canvasPos = this.transform(this.path[i+1]); // get end point transformed to canvas coordinate system
			this.context.lineTo( canvasPos.x, canvasPos.y );
			this.context.stroke();
		}
	},

	draw: function() {
		this.needsRedraw = true;
	},

	redraw: function() {
		if (this.needsRedraw == true) {
			this.context.clearRect(0, 0, this.canvas.width, this.canvas.height); // clear canvas
			this.drawPath(); // draw turtle path
			this.drawTurtle(); // draw turtle
			this.needsRedraw = false;
		}
	},

	resize: function() {
		this.canvas.height = this.canvas.clientHeight;
		this.canvas.width = this.canvas.clientWidth;
		this.draw();
		this.redraw();
	}

});

var turtleConsole;