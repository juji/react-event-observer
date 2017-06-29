var EventSystem = require('./lib/EventSystem.js');

// encapsulate public properties from private ones..
// like you encapsulate your mistress from your wife..
// khehehkeehekekekhekhekhekhe..

module.exports = function(){

	var event = new EventSystem();

	return {
		on: event.on,
		subscribe: event.on,

		off: event.off,
		unsubscribe: event.off,

		publish: event.trigger,
		trigger: event.trigger,
		emit: event.trigger,

		ask:event.ask,
		request:event.ask,

		respond:event.respond,
		answer:event.respond,

		silence:event.silence,
		leave:event.silence,

		getEvents:event.getEvents,
		getAllEvents:event.getAllEvents,
		getListeners:event.getListeners
	}
};
