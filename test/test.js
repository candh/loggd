// --------------------------------------
const loggd = require("../lib/index")
const db = new loggd("../db/test.json", {pretty: true});
// --------------------------------------

// --------------------------------------
let data = { username: "Vito Corleone", type: "Human" }
let data2 = [
    { username: "Tom Hagen", type: "Human", profession: "Lawyer" },
    { username: "Micheal Corleone", type: "Human" },
    { username: "Kay", type: "Human" },
    { username: "Fredo", type: "Human" },
    { username: "Kanye", type: "Human", profession: "Artist", albums: [] },
    { username: "Jay Z", type: "Human", profession: "Artist", albums: ["4:44"] },
    { username: "Frank", type: "Animal", skills: ["loving", "loyalty"], legs: 4 },
    { username: "Stanley", type: "Animal", skills: ["hating", "now idea what he's doing"], legs: 4 },
]

let sData = { type: "Animal" };
let sData2 = { username: "Kanye" };
let sData3 = { username: "Fredo" };
// --------------------------------------


describe('Loggd Testing\n-------------------------', function() {

    // 
    // loggd.find(criteria).then((data) => data.remove())  
    // clearing the entire file

    describe("#find->removeAll()", () => {
        it('should clear the file and then check if we get an empty array', (done) => {
            db.find({})
                .then((data) => {
                    data.removeAll()
                    done()
                })
        })
    })


    // 
    // loggd.insert(data)
    // 

    describe('#insert()', function() {
        it('should save 1 object in the file', function(done) {
            db.insert(data)
                .then((d) => {
                    done()
                })
        });
    });

    describe('#insert() with an array', function() {
        it('should save an array of objects in the file', function(done) {
            db.insert(data2)
                .then((data) => done())
                .catch((err) => console.error(err))
        });
    });

    // 
    // loggd.read()
    // 

    describe('#read()', function() {
        it('should read the file', function(done) {
            db.read()
                .then((data) => {
                    console.log(data);
                    done()
                })
                .catch((err) => console.error(err))
        });
    });

    // 
    // loggd.find(criteria)
    // 

    describe('#find()', function() {
        it('should find all the type: Animal objects', function(done) {
            db.find(sData)
                .then((data) => {
                    console.log(data.result);
                    done()
                })
                .catch((err) => console.error(err))
        });
    });

    describe('#find()->updateOne()', function() {
        it('should update one object', function(done) {
            db.find(sData2)
                .then((data) => {
                    data.result[0].username = "Kanye West"
                    data.result[0].albums.push("The College Dropout")
                    data.result[0].albums.push("Late Registration")
                    data.result[0].albums.push("Graduation")
                    data.updateOne(0).then((data) => {
                        console.log(data)
                        done()
                    })
                })
        });
    });


    describe('#find()->updateAll()', function() {
        it('should update all the objects that it found', (done) => {
            db.find(sData)
                .then((data) => {
                    data.result.forEach((e) => {
                        e.cute = true
                    })
                    data.result[0].skills.push("Just being amazing")
                    data.updateAll().then((d) => {
                        console.log(d)
                        done()
                    })
                })
                .catch((err) => console.error(err))
        })
    })

    describe('#find()->removeOne()', function() {
        it('should delete one object', function(done) {
            db.find(sData3)
                .then((data) => {
                    data.removeOne(0).then((d) => {
                        console.log(d)
                        done()
                    }).catch((err) => {
                        console.error(err)
                        done()
                    })
                })

        });
    });

});