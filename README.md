#loggd
A simple local [JSON](http://www.json.org/) database made with NodeJS, for NodeJS. I made this because I needed a simple interface to save and retrieve data from a JSON file. I looked up repos for doing that on github but I didn't like them because they were missing a function a two that I wanted... So I decided to make my own. I'm gonna use it for dev. purposes... Because I mean you can always use MongoDB for your live site 😊


```
[
  {
    "_id": "5a20dbc7-d48b-44c3-b44d-6f0c37edfe6f",
    "type": "Human",
    "username": "Kanye",
    "albums" : [
        "The Life of Pablo",
        "Yeezus",
        "Graduation",
        "My Beautiful Dark Twisted Fantasy"
    ]
  }
]
```


#Installation 

`npm install loggd --save`

#Usage

Well, first of all, import loggd in your project and then initiate the function by giving it a path to your JSON file, like this:

`const loggd = require("loggd")("./your/database/path/database.json");`


##Saving Data:

**`loggd.save(data, callback)`**
```
loggd.save({ username: "John", type: "Human" }, (err, data)=>{
    if(err) throw err;
    console.log(data);
});
```

##Reading Data:
Entire File

**`loggd.save(callback)`**
```
loggd.read((err, data) => {
    if (err) throw err;
    console.log(data)
});
```


##Find Data
All the matching objects, based on the given criteria, in the file:

**`loggd.find(criteria, callback)`**
```
loggd.find({username: "John"}, (err, data) => {
    if (err) throw err;
    console.log(data)
});
```


First occurence of the the matching object, based on the given criteria, in the file:

**`loggd.findOne(criteria, callback)`**
```
loggd.findOne({username: "John"}, (err, data) => {
    if (err) throw err;
    console.log(data)
});
```


##Update Data 
All the matching objects, based on the given criteria, in the file:

**`loggd.update(criteria, updatedData, callback)`**
```
loggd.update({username: "John"}, {username: "Haider"}, (err, data) => {
    if (err) throw err;
    console.log(data)
});
```


First occurence of the the matching object, based on the given criteria, in the file:

**`loggd.updateOne(criteria, updatedData, callback)`**
```
loggd.updateOne({username: "John"}, {username: "Haider"}, (err, data) => {
    if (err) throw err;
    console.log(data)
});
```


###hehehe, listen to this:
You can also `findOne()` and then call `update()` on the result. I'm just sayin bro 😉

##Remove Data:
All the matching objects, based on the given criteria, in the file

**`loggd.remove(criteria, callback)`**
```
loggd.remove({username: "Haider"}, (err, data) => {
    if (err) throw err;
    console.log(data)
});
```


#Examples

###Removing all the objects from the database

```
loggd.remove({}, (err, data) => {
    if (err) throw err;
    console.log(data)
});
```

Yeah I mean I don't have to add more example I just wanted to show you that you can do this too. Dat MongoDB style nawmsayin?


#Tests

`npm test`

#Contribution
- Clone the repo
- Add your method
- Test it
- Submit a PR
- Happy Coding 😊

#Wait, who made it? Not that I care or whatever but still?
By [@candhforlife](http://twitter.com/candhforlife) mostly seen at COMSATS Lahore doing CS stuff to get a CS degree


