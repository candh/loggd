// --------------------------------------
const loggd = require("../lib/loggd")
const assert = require("assert")
const db = new loggd('./db/test.json');
// --------------------------------------

// --------------------------------------
const data = { username: "Vito Corleone", type: "Human" }
const data2 = [
    { username: "Tom Hagen", type: "Human", profession: "Lawyer" },
    { username: "Micheal Corleone", type: "Human" },
    { username: "Kay", type: "Human" },
    { username: "Fredo", type: "Human" },
    { username: "Kanye", type: "Human", profession: "Artist", albums: [] },
    { username: "Jay Z", type: "Human", profession: "Artist", albums: ["4:44"] },
    { username: "Frank", type: "Animal", skills: ["loving", "loyalty"], legs: 4 },
    { username: "Stanley", type: "Animal", skills: ["hating", "no idea what he's doing"], legs: 4 },
]

const sData = { type: "Animal" };
const sData2 = { username: "Kanye" };
const sData3 = { username: "Fredo" };
// --------------------------------------

describe('Loggd Testing\n------------------', function() {
    //
    // loggd.clear()
    //
    describe("db.clear()", () => {
        it('should clear the file and then check if we get an empty array', (done) => {
            db.clear()
                .then(() => {
                    db.read()
                        .then((data) => {
                            assert.deepStrictEqual(data, [])
                            done()
                        })
                        .catch((err) => done(err))
                })
                .catch((err) => done(err))
        })
    })

    // 
    // loggd.insert(data)
    // 
    describe('db.insert()', function() {
        it('should save 1 object in the file', function(done) {
            db.insert(data)
                .then((d) => {
                    assert.deepStrictEqual(data, d[0])
                    done()
                })
                .catch((err) => done(err))
        });
    });
    
    describe('db.insert([])', function() {
        it('should save an array of objects in the file', function(done) {
            db.insert(data2)
                .then((data) => {
                    assert.deepStrictEqual(data2, data)
                    done()
                })
                .catch((err) => done(err))
        });
    });

    // 
    // loggd.read()
    // 
    describe('db.read()', function() {
        it('should read the file', function(done) {
            db.read()
                .then((data) => {
                    assert.ok(data.length === [data, ...data2].length)
                    done()
                })
                .catch((err) => done(err))
        });
    });

    // 
    // loggd.find(criteria)
    // 
    describe('db.find()', function() {
        it('should find all the type: Animal objects', function(done) {
            db.find(sData)
                .then((Data) => {
                    assert.ok(Data.result.length === 2)
                    done()
                })
                .catch((err) => done(err))
        });
    });

    // 
    // loggd.updateOne()
    // 
    describe('updateOne()', function() {
        it('should update one object', function(done) {
            db.find(sData2)
                .then((data) => {
                    let username = 'Kanye West'
                    let albums = ['The College Dropout', 'Late Registration', 'Graduation']
                    data.result[0].username = username
                    for (const album of albums) {
                       data.result[0].albums.push(album) 
                    }
                    data.updateOne(0).then((data) => {
                        data = data[0]
                        assert.ok(data.username === username)
                        assert.deepStrictEqual(data.albums, albums)
                        done()
                    }).catch((err) => done(err))
                })
                .catch((err) => done(err))
        });
    });

    // 
    // loggd.updateAll()
    // 
    describe('updateAll()', function() {
        it('should update all the objects that it found', (done) => {
            db.find(sData)
                .then((data) => {
                    const skill = "Just being amazing"
                    data.result.forEach((e) => {
                        e.cute = true
                        e.skills.push(skill)
                    })
                    data.updateAll().then((d) => {
                        for (const o of d) {
                           assert.ok(o.cute === true) 
                           assert.ok(o.skills.indexOf(skill) !== -1)
                        }
                        done()
                    })
                })
                .catch((err) => done(err))
        })
    })

    // 
    // loggd.removeOne()
    // 
    describe('removeOne()', function() {
        it('should delete one object', function(done) {
            db.find(sData3)
                .then((data) => {
                    data.removeOne(0).then((d) => {
                        db.find(sData3)
                            .then((Data) => {
                                assert.deepStrictEqual(Data.result, [])
                                done()
                            })
                    })
                    .catch((err) => done(err))
                })
                .catch((err) => done(err))
        })
    })

    // 
    // loggd.removeAll()
    // 
    describe('removeAll()', () => {
        it('should remove all objects of type Animal', (done) => {
            db.find(sData)
                .then((Data) => {
                    Data.removeAll()
                        .then(() => {
                            db.find(sData)
                                .then((Data) => {
                                    // >muh javascirpt is so sexy
                                    // >language of the future
                                    // foh
                                    assert.deepStrictEqual(Data.result, [])
                                    done()
                                })
                                .catch((err) => done(err))
                        }).catch((err) => done(err))
                }).catch((err) => done(err))
        })
    })

    after((done) => {
        db.clear()
            .then(() => {
                done()
            })
    })
})