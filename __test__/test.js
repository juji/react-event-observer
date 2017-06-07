var Observer = require('../index.js');

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
		expect(mainEvents.length).toBe(2);

	});

	it('should delete events',()=>{
		observer.unsubscribe('main');

		mainEvents = observer.getEvents('main');
		expect(mainEvents.length).toBe(0);

	});

});

describe('publish',function(){

	it('should publish events',function(){

		return new Promise((res,rej)=>{
			observer.subscribe('main',(data)=>{
				res(data);
			})
			observer.publish('main',1);	
		}).then(data => expect(data).toBe(1));
		
	});

	it('should handle multiple subscribers',function(){

		var t = 0;
		return new Promise((res,rej)=>{
			observer.subscribe('main2',(data)=>{
				t = t+data;
				if(t==2) res(t);
			});
			observer.subscribe('main2',(data)=>{
				t = t+data;
				if(t==2) res(t);
			});
			observer.publish('main2',1);	
		}).then(data => expect(data).toBe(2));
		
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
		}).then(data => expect(data).toBe(3));
		
	});

	it('should be able to respond with promise',function(){

		observer.respond('ask-promise',()=>{
			return Promise.resolve(3);
		});

		return new Promise((res,rej)=>{
			observer.ask('ask-promise',(data)=>{
				res(data);
			});
		}).then(data => expect(data).toBe(3));
		
	});	


	it('should be able to respond with async',function(){

		observer.respond('ask-async', async ()=>{
			return await Promise.resolve(3);
		});

		return new Promise((res,rej)=>{
			observer.ask('ask-async',(data)=>{
				res(data);
			});
		}).then(data => expect(data).toBe(3));
		
	});	


	it('should be able to handle error',function(){

		expect.assertions(1);

		observer.respond('ask-error', async ()=>{
			return await Promise.reject(new Error('some error'));
		});

		return new Promise((res,rej)=>{
			observer.ask('ask-error',(data,err)=>{
				if(err) rej(err);
				else res(data);
			});
		}).catch(e => expect(e).toBeInstanceOf(Error));
		
	});	

	

});