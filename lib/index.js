const fs = require('fs')
const p = require("path")
const _ = require('underscore')
const async = require('async')

// https://gist.github.com/jed/982883
// Returns a random v4 UUID
function uuid(a) {
    return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, uuid)
}

function loggd(path, options) {

    // kind of like a constructor
    // makes sure that the file is there
    {

        this.options = options || { pretty: true }
        // get path of the calling script
        // to construct the path for the JSON file
        this.path = p.join(p.dirname(module.parent.filename), path)


        // open the file
        try {
            let d = fs.readFileSync(this.path, "utf8")
            if (d.trim() === "") fs.writeFileSync(this.path, "[]", 'utf8')
        } catch (err) {
            if (err.code === 'ENOENT') {
                // this means the file doesn't exists
                fs.writeFileSync(this.path, "[]", 'utf8')
            } else {
                throw err;
            }
        }

    }


    /*
    insert
    @param data to be inserted
    @returns a Promise {data that was saved}
    */

    this.insert = (sData) => {
        return new Promise((fulfill, reject) => {
            if (typeof sData !== "object") {
                return reject(new Error("'data' given is not a object"))
            }

            // check if there are multiple records being inserted like [ {obj1}, {obj2}, {obj3} ]
            // give them all an _id
            if (sData instanceof Array) {
                for (i = 0; i < sData.length; i++) {
                    sData[i]["_id"] = uuid();
                }
            } else {
                sData["_id"] = uuid();
                sData = new Array(sData)
            }

            let parsed_data;
            fs.readFile(this.path, "utf8", (err, data) => {
                if (err) return reject(err);
                parsed_data = JSON.parse(data);
                async.each(sData, (obj, cb) => {
                    parsed_data.push(obj)
                    cb()
                }, (err) => {
                    if (err) return reject(err);
                    parsed_data = this.options.pretty ? JSON.stringify(parsed_data, null, '\t') : JSON.stringify(parsed_data)
                    fs.writeFile(this.path, parsed_data, "utf8", (err) => {
                        if (err) return reject(err);
                        fulfill(sData)
                    })
                })
            })
        })
    }

    /*
    read
    @returns a Promise {the entire file}
    */

    this.read = () => {
        return new Promise((fulfill, reject) => {
            fs.readFile(this.path, "utf8", (err, data) => {
                if (err) return reject(err)
                fulfill(JSON.parse(data))
            });
        })
    }

    /*
    find
    @param criteria against which the data will be filtered
    @returns a Promise {Data class of the objects filtered from the file}
    why A class? So we can have more control on every object!
    */

    this.find = (d) => {
        return new Promise((fulfill, reject) => {
            fs.readFile(this.path, "utf8", (err, data) => {
                if (err) return reject(err);
                data = JSON.parse(data)

                async.filter(data, (obj, callback) => {
                    // if it matched the criteria, filter it
                    callback(null, _.isMatch(obj, d))
                }, (err, results) => {
                    if (err) return reject(err);
                    // init the Data class
                    fulfill(new Data(results, this.path, this.options))
                })
            });
        })
    }

}

function Data(data, path, options) {

    this.result = data;

    /*
    updateAll
    @returns a Promise {the updated data}
    updates multiple objects at once
    */

    this.updateAll = () => {
        return new Promise((fulfill, reject) => {
            fs.readFile(path, "utf8", (err, data) => {
                if (err) return reject(err);
                data = JSON.parse(data)
                // loop on the this.result
                async.each(this.result, (res, callback) => {
                    // loop on the data in the file
                    async.each(data, (obj, cb) => {
                        // comapre them two based on the 'this.res._id'
                        if (_.isMatch(obj, { _id: res._id })) {
                            // if match, merge/extend the object
                            obj = _.extend(obj, res)
                        }
                        // callback of the inner loop
                        cb(null, true)
                    }, (err) => {
                        // callbacks for the outerloops
                        if (err) {
                            callback(err, false)
                        } else {
                            callback(null, true)
                        }
                    })
                }, (err) => {
                    // outer loop callback
                    if (err) return reject(err);

                    data = options.pretty ? JSON.stringify(data, null, '\t') : JSON.stringify(data)
                    fs.writeFile(path, data, "utf8", (err) => {
                        if (err) return reject(err)
                        fulfill(this.result)
                    });
                })
            });
        })
    }

    /*
    updateOne
    @returns a Promise {the updated object}
    only updated one object at once
    */

    this.updateOne = (index) => {
        let uData = this.result[index]
        return new Promise((fulfill, reject) => {
            if (uData == undefined) return reject(new Error("The specified object does not exists"))
            fs.readFile(path, "utf8", (err, data) => {
                if (err) return reject(err);
                data = JSON.parse(data)
                async.each(data, (obj, cb) => {
                    if (_.isMatch(obj, { _id: uData._id })) {
                        obj = _.extend(obj, uData)
                    }
                    cb(null, true)
                }, (err) => {
                    if (err) return reject(err);
                    data = options.pretty ? JSON.stringify(data, null, '\t') : JSON.stringify(data)
                    fs.writeFile(path, data, "utf8", (err) => {
                        if (err) return reject(err)
                        fulfill(this.result)
                    });
                })
            });
        })
    }

    /*
    removeAll
    @returns a Promise {the removed objects}
    removes all objects at once
    */

    this.removeAll = () => {
        return new Promise((fulfill, reject) => {
            fs.readFile(path, "utf8", (err, data) => {
                if (err) return reject(err)
                data = JSON.parse(data)

                async.each(this.result, (res, callback) => {
                    async.each(data, (obj, cb) => {
                        if (_.isMatch(obj, { _id: res._id })) {
                            data.splice(data.indexOf(obj), 1)
                        }
                        cb(null, true)
                    }, (err) => {
                        if (err) {
                            callback(err, false)
                        } else {
                            callback(null, true)
                        }
                    })
                }, (err) => {
                    if (err) return reject(err);

                    data = options.pretty ? JSON.stringify(data, null, '\t') : JSON.stringify(data)
                    fs.writeFile(path, data, "utf8", (err) => {
                        if (err) return reject(err)
                        fulfill(this.result)
                    });
                })
            });
        })
    }

    /*
    removeOne
    @returns a Promise {the removed object}
    removes one object at once
    */

    this.removeOne = (index) => {
        let uData = this.result[index]
        return new Promise((fulfill, reject) => {
            if (uData == undefined) return reject(new Error("The specified object does not exists"))
            fs.readFile(path, "utf8", (err, data) => {
                if (err) return reject(err)
                data = JSON.parse(data)
                async.each(data, (obj, cb) => {
                    if (_.isMatch(obj, { _id: uData._id })) {
                        data.splice(data.indexOf(obj), 1)
                    }
                    cb(null, true)
                }, (err) => {
                    if (err) return reject(err)
                    data = options.pretty ? JSON.stringify(data, null, '\t') : JSON.stringify(data)
                    fs.writeFile(path, data, "utf8", (err) => {
                        if (err) return reject(err)
                        fulfill(this.result)
                    });
                })
            })
        })
    }
}

module.exports = loggd;