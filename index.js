class EventSystem {

	constructor(){
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

	regRep(str){
		return str.replace(/[-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
	}

	/// get all event by name space
	getEvents(str){

		let r1 = new RegExp('^'+this.regRep(str)+'$');
		let r2 = new RegExp('^'+this.regRep(str)+'\.');

		var r = [];
		for(var i in this.list)
			if(i.match(r1) || i.match(r2)) 
				r.push(i);

		return r;

	}

	// random string
	randomString(){
		var str = ['1234567890QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm'];
		var r = '';
		for(var i=0;i<25;i++)
			r += str[Math.round(Math.random()*str.length)];
		return r;
	}

	// create random prefix
	randomPrefix(){
		this.askprefix = this.randomString();
	}


	// subscribe to event, support multiple handlers
	// support namespace by dot (.) ex: eventname.default
	// multiple level of namespace: eventname.default.xyz
	//
	// waterfall invocation: Event.trigger(eventname.default)
	// will invoke "eventname.default" & "eventname.default.xyz"
	on(str,call){
		if(!(str&&call)) { console.error('ReactObserver: \'on\' and \'subscribe\' method should have a valid event & callback'); return; }
		if(typeof str !== 'string') {console.error('ReactObserver: event name should be string'); return;}
		if(typeof call !== 'function') {console.error('ReactObserver: event name should be function'); return;}
		if(typeof this.list[str] === 'undefined') this.list[str] = [];
		this.list[str].push(call);
	}

	// unsubscribe from event, support multiple handlers
	// unsubscribe by namespace, or namespace + subscriber object
	// will delete all children event.
	//
	// e.g: Event.off( eventname.default )
	// will delete "eventname.default" and "eventname.default.xyz"
	//
	// e.g: Event.off( eventname.default, obj )
	// will delete "eventname.default" and "eventname.default.xyz"
	// for obj
	off(str){
		
		if(typeof this.list[str] === 'undefined') return;

		let r1 = new RegExp('^'+this.regRep(str)+'$');
		let r2 = new RegExp('^'+this.regRep(str)+'\.');

		for(var i in this.list)
			if(i.match(r1) || i.match(r2)) 
				delete this.list[i];

	}
	
	// trigger event and all children
	// use promise to invoke callbacks asynchronously
	trigger(str,data){
		let r1 = new RegExp('^'+this.regRep(str)+'$');
		let r2 = new RegExp('^'+this.regRep(str)+'\.');
		
		for(var i in this.list)
			if(i.match(r1) || i.match(r2)){
				let p = Promise.resolve(0);
				let idx = i;
				for(var j in this.list[idx]) 
					p = p.then((ii)=>{
						this.list[idx][ii](data);	
						return ii;
					});
			}
					
	}

	// /////////////////////////////
	// request - response protocol
	//

	// ask
	// callback will be executed on data arrival
	ask(str,callback){

		var uid = this.randomString();
		var wait = false;
		this.on(uid+this.askprefix+str,(data)=>{

			if(!data.err) callback(data.data);
			else callback(null,data.err);

			if(wait) clearTimeout(wait);
			wait = setTimeout(()=>{
				this.off(uid+this.askprefix+str);
			},100);

		});
		this.trigger(this.askprefix+str,uid);

	}

	// respond
	// callback should return data
	respond(str,callback){
		
		var t = this;
		this.on(this.askprefix+str,(uid)=>{

			var f = callback();

			if(typeof f.then === 'function' && typeof f.catch === 'function' )
				f.then((data)=>{
					t.trigger(uid+t.askprefix+str,{data:data,err:null});
				}).catch((e)=>{
					t.trigger(uid+t.askprefix+str,{data:null,err:e});
				});

			else t.trigger(uid+t.askprefix+str,{data:f,err:null});
			
		});

	}

	silence(str){
		this.off(this.askprefix+str);
	}

}

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