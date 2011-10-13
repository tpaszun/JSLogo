/* UserSketch Class & Events Prototype Implementation
 * Author: Dariusz Dziuk
 *
 * TODO : Better multiple inheritance
 *
 * Usage:
 * var MyClass = new Class( { firstProperty: 1, secondProperty: 2, method: function() { } } ) ;
 * var MyClass = new Class( { initialize: function() { // contents of constructor } } ) ;
 * var MySubClass = new Class( { Extends: MyClass } ) ; 
 *
 * Using Events:
 * - Adding event listener:
 *	 someObject.addEventListener( "eventName", function( sender, event ) ) ;
 *   someObject.addEventListener( "eventName", { _data_array_ }, function( sender, event )
 *
 *   You can access from event object:
 *   event.params (event parameters)
 *   event.data (event handler's data) if set 
 *
 * - Firing the event:
 *	 someObject.fireEvent( "eventName", params ) ;
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