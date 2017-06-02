var EventSystem = require('./lib/EventSystem.js');

// encapsulate public properties from private ones..
// like you encapsulate your mistress from your wife.. 
// khehehkeehekekekhekhekhekhe..

module.exports = function(){

	var event = new EventSystem();

	return {
		subscribe: event.on,
		unsubscribe: event.off,
		publish: event.trigger,
		on: event.on,
		off: event.off,
		trigger: event.trigger,
		ask:event.ask,
		respond:event.respond,
		silence:event.silence,
		getEvents:event.getEvents
	}
};