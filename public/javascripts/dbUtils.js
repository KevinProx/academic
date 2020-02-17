const MongoClient = require('mongodb').MongoClient;
const mongo = require('mongodb');

const connectionString = process.env.MONGO_CONNECTION_STRING || config.mongo_db_connection_string;

module.exports = {
    getResults: async function(database, collection, query) {
        return new Promise((resolve, reject) => MongoClient.connect(
            connectionString, { useUnifiedTopology: true },
            function (err, client) {
                let results = [];

                let cursor = client.db(database).collection(collection).find(query);

                cursor.forEach(function (doc) {
                    if (doc !== null) {
                        results.push(doc);
                    }
                }, function (err) {
                    client.close();
                    resolve(results);
                });
            }
        ));
    },

    update: async function(database, collection, object) {
        return new Promise(async (resolve, reject) => MongoClient.connect(
            connectionString, { useUnifiedTopology: true },
            async function (err, client) {
                await client.db(database).collection(collection).updateOne(
                    {
                        "_id" : object._id
                    },{$set : object });
                resolve(object._id);
            }
        ));
    },

    insert: async function(database, collection, object) {
        return new Promise(async (resolve, reject) => MongoClient.connect(
            connectionString, { useUnifiedTopology: true },
            async function (err, client) {
                await client.db(database).collection(collection).insertOne(object);
                resolve(true);
            }
        ));
    },

    getObjectID: function(id) {
        return new mongo.ObjectID(id);
    }
};