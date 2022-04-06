const { BigQuery } = require('@google-cloud/bigquery');

class Database {
    static inject = ["Configuration"];
    constructor(config) {
        this.queryClient = new BigQuery({ keyFilename: config.get("GC_KEY_FILENAME") });

        this.executeQuery = this.executeQuery.bind(this);
    }

    async executeQuery(query) {
        const options = {
            query: query,
            location: 'EU',
        };
        const [job] = await this.queryClient.createQueryJob(options);
        const [rows] = await job.getQueryResults();
        return rows;
    }
}

module.exports = Database;