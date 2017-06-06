'use strict';

var EventSystem = function(){
	this.list = [];
	this.on = this.on.bind(this);
	this.off = this.off.bind(this);
	this.ask = this.ask.bind(this);
	this.respond = this.respond.bind(this);
	this.silence = this.silence.bind(this);
	this.trigger = this.trigger.bind(this);
	this.getEvents = this.getEvents.bind(this);

	this.askprefix = '';
	this.randomPrefix();
}

EventSystem.prototype = {

	regRep: function(str){
		return str.replace(/[-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
	},

	/// get all event by name space
	getEvents: function(str){

		var r1 = new RegExp('^'+this.regRep(str)+'$');
		var r2 = new RegExp('^'+this.regRep(str)+'\.');

		var r = [];
		for(var i in this.list)
			if(i.match(r1) || i.match(r2)) 
				r.push(i);

		return r;

	},

	// random string
	randomString: function(){
		var str = ['1234567890QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm'];
		var r = '';
		for(var i=0;i<25;i++)
			r += str[Math.round(Math.random()*str.length)];
		return r;
	},

	// create random prefix
	randomPrefix: function(){
		this.askprefix = this.randomString();
	},


	// /////////////////////////////
	// PubSub protocol
	//

	// subscribe to event, support multiple handlers
	// support namespace by dot (.) ex: eventname.default
	// multiple level of namespace: eventname.default.xyz
	//
	// waterfall invocation: Event.trigger(eventname.default)
	// will invoke "eventname.default" & "eventname.default.xyz"
	on: function(str,call){
		if(!(str&&call)) { console.error('ReactObserver: \'on\' and \'subscribe\' method should have a valid event & callback'); return; }
		if(typeof str !== 'string') {console.error('ReactObserver: event name should be string'); return;}
		if(typeof call !== 'function') {console.error('ReactObserver: event callback should be function'); return;}
		if(typeof this.list[str] === 'undefined') this.list[str] = [];
		this.list[str].push(call);
	},

	// unsubscribe from event, support multiple handlers
	// unsubscribe by namespace, or namespace + subscriber object
	// will delete all children event.
	//
	// e.g: Event.off( eventname.default )
	// will delete "eventname.default" and "eventname.default.xyz"
	off: function(str){
		
		if(typeof this.list[str] === 'undefined') return;

		var r1 = new RegExp('^'+this.regRep(str)+'$');
		var r2 = new RegExp('^'+this.regRep(str)+'\.');

		for(var i in this.list)
			if(i.match(r1) || i.match(r2)) 
				delete this.list[i];

	},
	
	// trigger event and all children
	// use promise to invoke callbacks asynchronously
	trigger: function(str,data){
		var r1 = new RegExp('^'+this.regRep(str)+'$');
		var r2 = new RegExp('^'+this.regRep(str)+'\.');
		var _t = this;
		for(var i in this.list)
			if(i.match(r1) || i.match(r2)){
				var p = Promise.resolve(0);
				var idx = i;
				for(var j in this.list[idx]) 
					p = p.then(function(ii){
						_t.list[idx][ii](data);	
						return ii;
					});
			}
					
	},

	// /////////////////////////////
	// request - response protocol
	//

	// ask
	// callback will be executed on data arrival
	ask: function(str,callback){

		var uid = this.randomString();
		var _t = this;
		var wait = false;
		this.on(uid+this.askprefix+str,function(data){

			if(!data.err) callback(data.data);
			else callback(null,data.err);

			if(wait) clearTimeout(wait);
			wait = setTimeout(function(){
				_t.off(uid+_t.askprefix+str);
			},100);

		});
		this.trigger(this.askprefix+str,uid);

	},

	// respond
	// callback should return data
	respond: function(str,callback){
		
		var _t = this;
		this.on(this.askprefix+str,function(uid){

			var f = callback();

			if(typeof f.then === 'function' && typeof f.catch === 'function' )
				f.then(function(data){
					_t.trigger(uid+_t.askprefix+str,{data:data,err:null});
				}).catch(function(e){
					_t.trigger(uid+_t.askprefix+str,{data:null,err:e});
				});

			else _t.trigger(uid+_t.askprefix+str,{data:f,err:null});
			
		});

	},

	silence: function(str){
		this.off(this.askprefix+str);
	}

}

module.exports = EventSystem;