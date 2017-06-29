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
