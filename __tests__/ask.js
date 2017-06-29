var Observer = require('../index.js');
var observer = Observer();

describe('ask',()=>{

	it('should be able to retrieve answer when responders exists',()=>{

		expect.assertions(1)
		observer.respond('ask-test',()=>{
			return 1;
		})

		return new Promise(( resolve, reject )=>{
			observer.ask('ask-test',(ans)=>{
				resolve(expect(ans).toBe(1))
			})
		})

	})

	it('should be able to retrieve via promise',()=>{

		expect.assertions(1)

		return observer.ask('ask-test').then((ans)=>{
			expect(ans).toBe(1)
		})

	})

	it('should be able to handle async error',function(){

		expect.assertions(1);

		observer.respond('ask-error', ()=>{
			return Promise.reject('an error');
		});

		return new Promise((res,rej)=>{
			observer.ask('ask-error',(data,err)=>{
				if(err) rej(err);
				else res(data);
			});
		}).catch(e => expect(e).toBe('an error'));

	});

	it('should be able to handle responder error',function(){

		expect.assertions(1);

		observer.respond('ask-thrown', ()=>{
			throw 'some error';
		});

		return observer.ask('ask-thrown')
		.catch((e)=>{
			expect(e).toBe('some error')
		})

	});

})
