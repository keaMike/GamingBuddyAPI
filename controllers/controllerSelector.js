exports.controller = (type) => {
    switch (type) {
        case 'user' : {
            switch (process.env.DB_CHOICE) {
                case 'mongo' : return require('./users/mongoUserController')
                case 'mysql' : return require('./users/mysqlUserController')
                case 'neo4j' : return require('./users/neo4jUserController')
            }
            break
        }
        case 'swipe' : {
            switch (process.env.DB_CHOICE) {
                case 'mongo' : return require('./swipes/mongoSwipeController')
                case 'mysql' : return require('./swipes/mysqlSwipeController')
                case 'neo4j' : return require('./swipes/neo4jSwipeController')
            }
        }
    }
}