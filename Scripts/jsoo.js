/* Jsoo v0.1
 *
 * Copyright (C) 2011 by Dariusz Dziuk
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/* Class implementation */
function Class( params ) {

	/* Creating a new class constructor function */
	var constructor = function()
	{
		/* Copying the class properties */
		for ( var property in params )
		{
			this[ property ] = params[ property ] ;
		}

		/* Running the initialization method if possible with the argument */
		if ( !constructor.$prototyping )
		{
			/* Preparing the events mechanism */
			this.events = new Array() ;
		
			/* Binding the addEventListener method */
			this.addEventListener = function( eventName, eventHandlerData, eventListener )
			{
				/* Checking if eventListener is set - if not, it means that there are just two arguments,
				so there's no eventHandlerData as it represents the eventListener itself */
				if ( eventListener == null ) {
					eventListener = eventHandlerData ;
					eventHandlerData = null ;
				}
		
				/* If event handler not present - create it */
				if ( this.events[ eventName ] === undefined ) {
					this.events[ eventName ] = new Array() ;
				}
		
				/* Binding the event */
				this.events[ eventName ].push( { listener: eventListener, handlerData: eventHandlerData } ) ;
			}
		
			/* Binding the fireEvent method */
			this.fireEvent = function( eventName, eventParams )
			{
				/* If event handler present - fire the listeners */
				if ( this.events[ eventName ] !== undefined )
				{
					for( var listenerIndex in this.events[ eventName ] )
					{
						/* Getting the listener object */
						listenerObject = this.events[ eventName ][ listenerIndex ] ;
						
						/* Firing the event */
						listenerObject.listener( this, { data: listenerObject.handlerData, params: eventParams } ) ;
					}
				}
			}

			/* Running the constructor */
			if ( this[ "initialize" ] !== undefined ) {
				this[ "initialize" ].apply( this, arguments ) ;
			}
		}
	}

	/* Setting inheritance by "Implements" */
	if ( params[ "Extends" ] !== undefined )
	{		 
		/* Setting the prototype (with using the prototyping flag in order not to run the constructor) */
		params[ "Extends" ].$prototyping = true ;
		constructor.prototype = new params[ "Extends" ] ;
		delete params[ "Extends" ].$prototyping ;
	} 

	/* Returning the new class */
	return constructor ;
}

/* Opera browser getPrototypeOf support */
if ( typeof Object.getPrototypeOf !== "function" )
{
	if ( typeof "test".__proto__ === "object" )
	{
		/* Defining the getPrototypeOf function */
    	Object.getPrototypeOf = function( object )
    	{
      		return object.__proto__ ;
    	} ;
  	} 
  	else
  	{
    	Object.getPrototypeOf = function( object )
    	{
      		return object.constructor.prototype ;
    	} ;
  	}
}