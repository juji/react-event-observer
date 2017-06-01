react-observer 
===

An event manager in ReactJs, to handle communication between **components**. <br />
Using [observers](https://en.wikipedia.org/wiki/Observer_pattern) as a message-broker between components.

Or you can use it for a general purpose event system.<br />

```
npm install --save react-observer
```

Features
--
- PubSub
- request-response
- namespacing

**What is this:**
- General javascript Event System.
- inter-component communication channel for ReactJs.

You can think of it as a network between components.

**What This is not:**
- client-server communication library
- client-client communication library

**Why?**<br />
Because passing down methods to child components cluters your code.
```bash
and monolithic.. 
```

---

Initialize
--
```js
import ReactObserver from 'react-observer';
var observer = ReactObserver();
```

Methods: PubSub
--
```js
/* subscribe to event */
observer.subscribe('exampleEvent',(data)=>{
    console.log('data is: '+data);
});

/* publish event */
observer.publish('exampleEvent', 1+9);
// data is: 10

/* unsub */
observer.unsubscribe('exampleEvent');
```

Methods: request-response
--
```js
/* prepare to respond to answer */
observer.respond('what is three',()=>{
    return 3;
});

/* ask the question */
observer.ask('what is three',(data)=>{
    console.log('Three is a ' + (typeof data));
});
// Three is a number


/* stop responding to questions */
observer.silence('what is three');

```

---

Usage Example
--
Include react-observer in your Parent Component
```js
import ReactObserver from 'react-observer';
```

### Initialize in parent
Initialize in Parent constructor, and pass down to child components
```js
class App extends Component {
	constructor(props){
	    super(props);
	    this.observer = ReactObserver();
	}
	...
	
	render(){
        <div>
            <AppChild observer=this.observer />
            <AppChild observer=this.observer />
            <AppChildCounter observer=this.observer />
        </div>
    }
}
```

### Subscribe / publish events
In Child Components, start listening to events on mount. Don't forget to unsubscribe on unmount.
**AppChild**
```js
class AppChild extends Component{
    constructor(props){
        super(props);
        this.observer = props.observer;
    }
    
    componentDidMount(){
        this.observer.subscribe("hello",(data)=>{
            console.log('hello event data: ' + data);
        });
        
        this.observer.respond("attendanceRoll",()=>{
            return 1;
        });
    }

    componentWillUnmount(){
        this.observer.silence("attendanceRoll");
    }
    ...
}
```

`AppChildCounter` is where we will publish event or ask questions.
**AppChildCounter**
```js
class AppChildCounter extends Component{
    constructor(props){
        super(props);
        this.observer = props.observer;
        this.state = {attending : 0};
    }
    
    componentDidMount(){
        this.observer.publish("hello",'this is data');
        this.observer.ask("attendanceRoll",(data)=>{
            this.setState( (prev,props)=>({ attending: prev.attending + data }) );
            console.log('attending: '+this.state.attending);
        });
    }
    ...
}
```

Check the result in your console
```
Console
=======

hello event data: this is data
hello event data: this is data
attending: 2
```

---

Feature: event-namespace
--
The dot (`.`) is used as a namespace separator.
```js
observer.subscribe('main',()=>{ console.log('main'); });
observer.subscribe('main.child',()=>{ console.log('main.child'); });
observer.subscribe('main.child.child',()=>{ console.log('main.child.child'); });

/* all child and grandchild will be called on parent invocation */
observer.publish('main');
// main
// main.child
// main.child.child

observer.publish('main.child');
// main.child
// main.child.child

/* the same goes for unsubscribe method */
observer.unsubscribe('main.child',()=>{ console.log('main'); });
observer.publish('main');
// main
```

cheers,
[him@jujiyangasli.com](mailto:him@jujiyangasli.com)