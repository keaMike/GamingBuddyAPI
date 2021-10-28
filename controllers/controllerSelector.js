exports.controller = () => {
    switch (process.env.DB_CHOICE) {
        case 'mongo' : return require('./mongoUserController');
        case 'mysql' : return require('./mysqlUserController');
    }
}