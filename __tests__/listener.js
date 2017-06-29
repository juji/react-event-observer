var Observer = require('../index.js');
var observer = Observer();


describe('listener',()=>{

	it('should unpublish a single listener',function(){

		expect.assertions(2)
		var listen1, listen2;

		// using returned function
		var p = new Promise((r,J)=>{
			listen1 = observer.on('unsubtask',()=>{
				r(true)
			})
		});

		var r = new Promise((r,J)=>{
			listen2 = observer.on('unsubtask',()=>{
				r(true)
			})
		});

		observer.emit('unsubtask')

		return p.then(()=>{
			return r
		}).then(()=>{
			expect( observer.getListeners('unsubtask').length ).toBe(2)
			listen1.unsubscribe();
			expect( observer.getListeners('unsubtask').length ).toBe(1)
		})

	})

	it('should fire an error event when callback throws error',()=>{

		expect.assertions(1)
		var listener = observer.on('test-error',()=>{
			throw new Error('test-error')
		})

		var p = new Promise((res,rej)=>{

			listener.on('error',(e)=>{
				res(e)
			})

		}).then((e)=>{

			expect(e.toString()).toMatch('test-error')

		})

		observer.emit('test-error')
		return p

	})

	it('should fire a succeed event when callback executed',()=>{

		expect.assertions(0)
		var listener = observer.on('test-error',()=>{
			return 3;
		})

		var p = new Promise((res,rej)=>{

			listener.on('succeed',()=>{
				res()
			})

		})

		observer.emit('test-error')
		return p

	})
})
