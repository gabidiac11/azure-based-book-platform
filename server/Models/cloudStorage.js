const {Storage} = require('@google-cloud/storage');
const storage = new Storage({keyFilename: 'cloud-computing-2022-345016-ede0eee78aaa.json'});
const uuid = require('uuid');
const bucketName = 'cloud-computing-2022-345016.appspot.com';
const url = `https://storage.googleapis.com/${bucketName}/`;

function uuidv4() {
    return uuid.v4();
}
  

const upload = async (file) => {
    const fileName = uuidv4() + '.jpg';
    await storage.bucket(bucketName).file(fileName).save(file.buffer);
    await storage.bucket(bucketName).file(fileName).makePublic();
    return url + fileName;
}

const uploadFile = async (file, name) => {
    const fileName = name;
    await storage.bucket(bucketName).file(fileName).save(file.buffer);
    await storage.bucket(bucketName).file(fileName).makePublic();
    return url + fileName;
}

module.exports = {
    upload,
    storage,
    uploadFile
}