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

	it('should respond to question',function(){

		observer.respond('ask',()=>{
			return 3;
		});

		return new Promise((res,rej)=>{
			observer.ask('ask',(data)=>{
				res (data);
			});
		}).then((d)=>{
			d.should.equal(3);
		});
		
	});

	it('should respond to question asynchronously',function(){

		observer.respond('ask',()=>{
			return new Promise().resolve(3);
		});

		return new Promise((res,rej)=>{
			observer.ask('ask',(data)=>{
				res(data);
			});
		}).then((d)=>{
			d.should.equal(3);
		});
		
	});	

});