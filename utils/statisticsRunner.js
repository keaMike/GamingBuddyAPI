const neo4jStatisticController = require('../controllers/statistics/neo4jStatisticController')
const mongoStatisticController = require('../controllers/statistics/mongoStatisticController')

exports.startStatistic = () => {
    setInterval(() => {
        neo4jStatisticController.generateStatistics()
        mongoStatisticController.generateStatistics()
    }, 10000)
}