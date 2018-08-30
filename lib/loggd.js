const fs = require('fs')
const p = require('path')
const _ = require('underscore')
const async = require('async')

// https://gist.github.com/jed/982883
// Returns a random v4 UUID
function uuid(a) {
    return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, uuid)
}

class loggd {
    /**
     * Inits the path to be used later and inits the .json file
     * @constructor
     * @param {string} path - The absolute or relative path of the .json database
     * @param {object} options - Options
     */
    constructor(path, options={pretty: true}) {
        if (!path) {
            return new Error('No path supplied')
        }
        this.options = options

        // get path of the calling script
        // to construct the path for the JSON file
        let dirname
        if (module.parent.filename != null) {
            dirname = p.dirname(module.parent.filename)
        } else {
            // if called from interpreter
            const process = require('process')
            dirname = process.cwd()
        }

        this.path = p.join(dirname, path)

        try {
            const d = fs.readFileSync(this.path, 'utf8')
            // if file is completely empty, insert a empty array
            if (d.trim() === '')
                fs.writeFileSync(this.path, '[]', 'utf8')
        }
        catch (err) {
            if (err.code === 'ENOENT') {
                // this means the file doesn't exists
                fs.writeFileSync(this.path, '[]', 'utf8')
            }
            else {
                throw err
            }
        }
    }

    /**
     * Insert object in the database
     * @param {object} data - The object that you want to save
     * @return {Promise<Array>} - The data it just saved
     */
    insert(sData) {
        return new Promise((fulfill, reject) => {
            if (typeof sData !== 'object') {
                return reject(new Error("'data' given is not a object"))
            }
            // check if there are multiple records being inserted like [ {obj1}, {obj2}, {obj3} ]
            // give them all an _id
            if (sData instanceof Array) {
                sData = sData.map((el) => {
                    el['_id'] = uuid()
                    return el
                })
            } else {
                sData['_id'] = uuid()
                sData = new Array(sData)
            }

            let parsed_data
            fs.readFile(this.path, 'utf8', (err, data) => {
                if (err)
                    return reject(err)
                parsed_data = JSON.parse(data)
                async.each(sData, (obj, cb) => {
                    parsed_data.push(obj)
                    cb()
                }, (err) => {
                    if (err)
                        return reject(err)
                    parsed_data = this.options.pretty ? JSON.stringify(parsed_data, null, '\t') : JSON.stringify(parsed_data)
                    fs.writeFile(this.path, parsed_data, 'utf8', (err) => {
                        if (err)
                            return reject(err)
                        fulfill(sData)
                    })
                })
            })
        })
    }

    /**
     * Read the entire database
     * @return {Promise<Array>} - The data from the database
     */
    read() {
        return new Promise((fulfill, reject) => {
            fs.readFile(this.path, 'utf8', (err, data) => {
                if (err) return reject(err)
                fulfill(JSON.parse(data))
            })
        })
    }

    /**
     * Find objects in the database
     *
     * @param {object} criteria - Criteria against which the data will be filtered
     * @return {Promise<Data>} - The data it just saved
     * why A class? So we can have more control on every object!
     */
    find(criteria) {
        return new Promise((fulfill, reject) => {
            fs.readFile(this.path, 'utf8', (err, data) => {
                if (err)
                    return reject(err)
                data = JSON.parse(data)
                async.filter(data, (obj, callback) => {
                    // if it matched the criteria, filter it
                    callback(null, _.isMatch(obj, criteria))
                }, (err, results) => {
                    if (err)
                        return reject(err)
                    // return the Data class
                    fulfill(new Data(results, this.path, this.options))
                })
            })
        })
    }

    /**
     * Clears the entire database
     * or more specifically, deletes the database file and recreates
     * it and adds a empty array to it
     *
     * @return {Promise<null>} returns nothing, really.
     */
    clear() {
        return new Promise((fulfill, reject) => {
            fs.unlink(this.path, (err) => {
                if (err)
                    return reject(err)
                fs.writeFile(this.path, '[]', 'utf8', (err) => {
                    if (err)
                        return reject(err)
                    fulfill()
                })
            })
        })
    }
}

// still a function because javascript doesn't support private
// properties and i wanna keep `path` and `options` private
// i mean there are some pattern/hacks but come on JS
function Data(data, path, options) {
    this.result = data
   
    /**
     * Update all the objects in the Data.result[]
     * @return {Promise<Array>} - returns entire updated Data.result[]
     */
    this.updateAll = () => {
        return new Promise((fulfill, reject) => {
            fs.readFile(path, 'utf8', (err, data) => {
                if (err)
                    return reject(err)
                data = JSON.parse(data)
                // loop on the this.result
                async.each(this.result, (res, callback) => {
                    // loop on the data in the file
                    async.each(data, (obj, cb) => {
                        // compare them two based on the 'this.res._id'
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
                    if (err)
                        return reject(err)
                    data = options.pretty ? JSON.stringify(data, null, '\t') : JSON.stringify(data)
                    fs.writeFile(path, data, 'utf8', (err) => {
                        if (err)
                            return reject(err)
                        fulfill(this.result)
                    })
                })
            })
        })
    }

    /**
     * Update only the speicfied object from the Data.result[] 
     *
     * @param {index} index - index of the object in Data.result[] that you want to change
     * @return {Promise<Array>} - returns entire updated Data.result[]
     */
    this.updateOne = (index) => {
        const uData = this.result[index]
        return new Promise((fulfill, reject) => {
            if (uData == undefined)
                return reject(new Error('The specified object does not exists'))
            fs.readFile(path, 'utf8', (err, data) => {
                if (err)
                    return reject(err)
                data = JSON.parse(data)
                async.each(data, (obj, cb) => {
                    if (_.isMatch(obj, { _id: uData._id })) {
                        obj = _.extend(obj, uData)
                    }
                    cb(null, true)
                }, (err) => {
                    if (err)
                        return reject(err)
                    data = options.pretty ? JSON.stringify(data, null, '\t') : JSON.stringify(data)
                    fs.writeFile(path, data, 'utf8', (err) => {
                        if (err)
                            return reject(err)
                        fulfill(this.result)
                    })
                })
            })
        })
    }
    
    /**
     * Deletes all the objects from Data.result[] from the database
     * @return {Promise<Array>} - returns entire updated Data.result[]
     */
    this.removeAll = () => {
        return new Promise((fulfill, reject) => {
            fs.readFile(path, 'utf8', (err, data) => {
                if (err)
                    return reject(err)
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
                    if (err)
                        return reject(err)
                    data = options.pretty ? JSON.stringify(data, null, '\t') : JSON.stringify(data)
                    fs.writeFile(path, data, 'utf8', (err) => {
                        if (err)
                            return reject(err)
                        fulfill(this.result)
                    })
                })
            })
        })
    }

    /**
     * Deletes only the speicfied object from the Data.result[] 
     *
     * @param {index} index - index of the object that you want to delete
     * @return {Promise<Array>} - returns entire updated Data.result[]
     */
    this.removeOne = (index) => {
        const uData = this.result[index]
        return new Promise((fulfill, reject) => {
            if (uData == undefined)
                return reject(new Error('The specified object does not exists'))
            fs.readFile(path, 'utf8', (err, data) => {
                if (err)
                    return reject(err)
                data = JSON.parse(data)
                async.each(data, (obj, cb) => {
                    if (_.isMatch(obj, { _id: uData._id })) {
                        data.splice(data.indexOf(obj), 1)
                    }
                    cb(null, true)
                }, (err) => {
                    if (err)
                        return reject(err)
                    data = options.pretty ? JSON.stringify(data, null, '\t') : JSON.stringify(data)
                    fs.writeFile(path, data, 'utf8', (err) => {
                        if (err)
                            return reject(err)
                        fulfill(this.result)
                    })
                })
            })
        })
    }
}

module.exports = loggd
