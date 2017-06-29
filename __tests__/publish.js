var Observer = require('../index.js');
var observer = Observer();

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
