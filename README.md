# jsonize-javascript-client 0.0.1

This is the Jsonize Javascript Client.


## Getting Started


```javascript
	npm install jsonize-javascript-client
```



## Basic Usage


```javascript
    var jsonize = Jsonize.SocketJsonize.createByURL("http://localhost:1234");
    jsonize.invoke({task: "echo", payload: {foobar: 42}}, {
        success: function (payload) {
            console.log("Success", payload);
        }
    });
```

## Contributors

- Foodji
- Oliver Friedmann


## License

Apache-2.0

