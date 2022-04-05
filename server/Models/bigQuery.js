const {BigQuery} = require('@google-cloud/bigquery');
const bigqueryClient = new BigQuery({keyFilename: 'cloud-computing-2022-345016-ede0eee78aaa.json'});

const executeQuery = async (query) => {
    const options = {
        query: query,
        location: 'EU',
      };
    const [job] = await bigqueryClient.createQueryJob(options);
    const [rows] = await job.getQueryResults();
    return rows;
} 

module.exports = {
    bigqueryClient,
    executeQuery
}