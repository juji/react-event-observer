react-event-observer
===

An event manager in ReactJs, to handle communication between **components**. <br />
Using [observers](https://en.wikipedia.org/wiki/Observer_pattern) as a message-broker between components.

Or you can use it for a general purpose event system.<br />

```
npm install --save react-event-observer
```

[Full reference](#full-reference)

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
import ReactObserver from 'react-event-observer';
var observer = ReactObserver();
```

Methods: PubSub
--
```js
/*
    subscribe to event
    will return a 'Listener'
    Read about Listener below
*/

var listener = observer.subscribe('exampleEvent',(data)=>{
    console.log('data is: '+data);
});

/* publish event */
observer.publish('exampleEvent', 1+9);
// data is: 10

/* unsub */
observer.unsubscribe('exampleEvent');
```

### Listener
A `Listener` is an object returned from subscribing to and event.
It will notify `succeed` and `error`of your function call. it alse has an `unpublish` method, so you can unpublish your function from the observer.

```js
listener.on('error',(e)=>{
    console.log('Your function has error:')
    console.log(e);
})

listener.on('succeed',()=>{
    console.log('Your function was successfully executed')
})

// unsubscribe from event
// for this particular function
listener.unsubscribe()
```


Methods: request-response
--
```js
/* prepare to respond to answer */
observer.respond('what is three',()=>{
    return 3;
});

/* ask the question */
observer.ask('what is three',(data,error)=>{
    if(error) console.log('a error: '+e.stoString());
    else console.log('Three is a ' + (typeof data));
});
// Three is a number


/* stop responding to questions */
observer.silence('what is three');

```

---

Usage Example
--
Include react-event-observer in your Parent Component
```js
import ReactObserver from 'react-event-observer';
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
            <AppChild observer={this.observer} />
            <AppChild observer={this.observer} />
            <AppChildCounter observer={this.observer} />
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

        // you can return promise, for async calls
        // (everything with `.then` and `.catch`)
        this.observer.respond("attendanceRoll",()=>{
            return Promise.resolve(1);
        });

        // so, async is supported
        this.observer.respond("attendanceRoll",async ()=>{
            return await Promise.resolve(1);
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
...
attending: 1
attending: 2
attending: 3
attending: 4
...
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


---------------

Full Reference
---

### Observer
`Observer` is a multipurpose event system.

#### constructor
```
var observer = Observer()
```

#### Methods

###### observer.subscribe( String: event, Function: callback )
Alias: `observer.on`

Return: `Listener` object

Subscribe to an event. The callback will receive data.


###### observer.unsubscribe( String: event, [Listener: listener] )
Alias: `observer.off`

Unsubscribe to an event. The absence of listener will delete all listener associated with the event.

###### observer.publish( String: event, [Mixed: data] )
Alias: `observer.trigger` `observer.emit`

Publish data on an event. Data will be passed to all listener's function as a parameter.

###### observer.request( String: event, [Function: callback] )
Alias: `observer.ask`

Ask for data. This is a one time event, so it will be unregistered upon callback succession. When no responder available, callback will never be called.

###### observer.respond( String: event, [Function: callback] )
Alias: `observer.answer`

Respond to a `request`. Unlike `request`, `respond` will always listen to event. You can think of it as a subscriber that gives data.

To respond to a request, you should return a value, or a promise.
```js
observer.answer('question',function(){
    return 3;
})

observer.answer('question',function(){
    return Promise.resolve(3);
})
```

###### observer.silence( String: event )
Alias: `observer.leave`

Stop responding to requests.

###### observer.getEvents( String: event )

Get events. children will be included in the result

###### observer.getAllEvents( String: event )

Get All events.

###### observer.getListeners( String: event )

Get All listeners. Events will be evaluated with strict values. children will not be included.


### Listener

`Listener` is on object returned from subscribing on an event. It is used to catch errors and successions of the callback function. It also used to unsubscribe by calling `unsubscribe` method, or passing it to the second parameter of `observer.unsubscribe`.

#### Methods

###### listener.on( String: event, Function: callback )
This will register callback to events such ass `error` and `succeed`.

###### listener.unsubscribe()
Alias: `listener.off`

Unsubscribe this listener from it's event. Other way to unsubscribe is by passing this listener to `observer.unsubscribe`

```js
var listener1 = observer.on('event',()=>{ })
var listener2 = observer.on('event',()=>{ })

// unsubscribe
listener1.unsubscribe();

// also unsubscribe
observer.unsubscribe('event', listener2)
```

#### Events
`Listener` have events. You can register callback to listen to those using `listener.on` method.

|Event|Description|
|---|---|
|error|Will be fired when the callback has errors. This is the only way we can catch errors, since the callback will be called asynchronously. The error object will be passed to function registered to this event|
|succeed|Will be called upon sucessfull callback execution. It carries no data|

That's it.

cheers,
[him@jujiyangasli.com](mailto:him@jujiyangasli.com)
