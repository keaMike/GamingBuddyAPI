exports.controller = () => {
    switch (process.env.DB_CHOICE) {
        case 'mongo' : return require('./users/mongoUserController');
        case 'mysql' : return require('./users/mysqlUserController');
    }
}