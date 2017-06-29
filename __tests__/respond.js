var Observer = require('../index.js');
var observer = Observer();

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

});
