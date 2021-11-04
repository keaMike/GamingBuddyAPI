const neo4j = require('neo4j-driver')

exports.driver = neo4j.driver(
    process.env.NEO4J_DB_URL,
    neo4j.auth.basic(
        process.env.NEO4J_DB_USERNAME,
        process.env.NEO4J_DB_PASSWORD
    )
)