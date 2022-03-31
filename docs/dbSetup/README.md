# GamingBuddy

## MySQL
The database is setup with *mysql/database_setup.sql*.
After this the test data can be loaded with either *mysql/test_data/all_test_data.sql* or the individual files in the same directory.

## MongoDB
The database consists of one collection **messages**.
Test data for this collection is in *mongodb/messages.json* and indexes for the collection is in *mongodb/indexes_on_messages_collection.json*.
The indexes can be created with the *[createIndex()](https://docs.mongodb.com/manual/reference/method/db.collection.createIndex/)* method.

## Neo4j
The database dump in *neo4j/neo4j.dump* can be restored with the *[load](https://neo4j.com/docs/operations-manual/current/backup-restore/restore-dump/)* functionality in **neo4j-admin**.