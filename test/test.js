const assert = require('assert');
const loggd = require("../lib/index")("./db/test.json");
const underscore = require("underscore");

let data = { username: "John", type: "Human" };
let data2 = { username: "John", type: "Alien" };
let data3 = { username: "John", type: "Dog" };
let sData = { username: "John" };
let sData2 = { type: "Dog" };
let updated = { username: "Leo", type: "Human" };
let updated2 = { username: "Kanye", type: "Human" };

describe('Loggd', function() {

    // 
    // loggd.save(saveData, callback)
    // 

    describe('#save()', function() {
        let processed = 0;
        it('should save the data in the file', function(done) {
        	loggd.save(data, (err, data)=>{
        		if(err) throw err;
        		loggd.save(data2, (err, data)=>{
        			if(err) throw err;
        			loggd.save(data3, (err, data)=>{
        				if(err) throw err;
        				done();
        			})
        		})
        	});
        });
    });

    // 
    // loggd.read(callback)
    // 

    describe('#read()', function() {
        it('should read the file', function(done) {
            loggd.read((err, d) => {
                console.log(d)
                done();
            })
        });
    });

    // 
    // loggd.find(criteria, callback)
    // 

    describe('#find()', function() {
        it('should find all the matching objects', function(done) {
            loggd.find(sData, (err, data) => {
                if (err) throw err;
                console.log(data);
                done();
            })
        });
    });

    // 
    // loggd.findOne(criteria, callback)
    // 

    describe('#findOne()', function() {
        it('should find the first occurence of the matching object', function(done) {
            loggd.findOne(sData2, (err, data) => {
                if (err) throw err;
                console.log(data);
                done();
            })
        });
    });

    // 
    // loggd.updateOne(criteria, callback)
    // 

    describe('#updateOne()', function() {
        it('should update the first occurence of the matching object', function(done) {
            loggd.updateOne(sData, updated, (err, data) => {
                if (err) throw err;
                console.log(data);
                done();
            })
        });
    });


    // 
    // loggd.update(criteria, callback)
    //

    describe('#update()', function() {
        it('should update all the elements that matches the criteria', function(done) {
            loggd.update(sData, updated2, (err, data) => {
                if (err) throw err;
                console.log(data);
                done();
            })
        });
    });


    // 
    // loggd.remove(criteria, callback)
    //

    describe('#remove()', function() {
        it('should remove all the elements that matches the criteria', function(done) {
        	// for the test, we gon' remove all the elements
            loggd.remove({}, (err, data) => {
                if (err) throw err;
                done();
            })
        });
    });


});
