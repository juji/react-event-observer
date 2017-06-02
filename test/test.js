var unirest = require('unirest');
var Observer = require('../index.js');
var chai = require('chai');

var should = chai.should();
var observer = Observer();

//http://api.fixer.io/latest
describe('subscribe',function(){

	it('should register events',function(){
		observer.subscribe('main',(data)=>{
			console.log(data);
		});

		observer.subscribe('main.child',(data)=>{
			console.log(data);
		});

		var mainEvents = observer.getEvents('main');
		mainEvents.length.should.equal(2);

	});

	it('should delete events',()=>{
		observer.unsubscribe('main');

		mainEvents = observer.getEvents('main');
		mainEvents.length.should.equal(0);
	});

});

describe('publish',function(){

	it('should publish events',function(){

		return new Promise((res,rej)=>{
			observer.subscribe('main',(data)=>{
				res(data);
			});
			observer.publish('main',1);	
			//observer.unsubscribe('main');

		}).then((data)=>{
			data.should.equal(1);
		});
		
	});

});

describe('respond',function(){

	it('should be able to respond to question',function(){

		observer.respond('ask',()=>{
			return 3;
		});

		return new Promise((res,rej)=>{
			observer.ask('ask',(data)=>{
				res(data);
			});
		}).then((d)=>{
			d.should.equal(3);
		});
		
	});

	it('should be able to respond with promise',function(){

		observer.respond('ask-promise',()=>{
			return Promise.resolve(3);
		});

		return new Promise((res,rej)=>{
			observer.ask('ask-promise',(data)=>{
				res(data);
			});
		}).then((d)=>{
			d.should.equal(3);
		});
		
	});	


	it('should be able to respond with async',function(){

		observer.respond('ask-async', async ()=>{
			return await Promise.resolve(3);
		});

		return new Promise((res,rej)=>{
			observer.ask('ask-async',(data)=>{
				res(data);
			});
		}).then((d)=>{
			d.should.equal(3);
		});
		
	});	


	it('should be able to handle error',function(){

		observer.respond('ask-error', async ()=>{
			return await Promise.reject(new Error('some error'));
		});

		return new Promise((res,rej)=>{
			observer.ask('ask-error',(data,err)=>{
				if(!err) res(data);
				else rej(err);
			});
		}).then((d)=>{
			d.should.equal(3);
		}).catch((e)=>{
			e.should.be.an('error');
		});
		
	});	

	

});