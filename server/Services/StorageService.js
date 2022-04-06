const { Storage } = require('@google-cloud/storage');
const uuid = require('uuid');

class StorageService {
    static inject = ["Configuration"];
    constructor(config) {
        this.storage = new Storage({ keyFilename: config.get("GC_KEY_FILENAME") });
        this.baseUrl = config.get("FILE_STORAGE_BASE_URL");
        this.bucketName = config.get("BUCKET_NAME");

        this.upload = this.upload.bind(this);
        this.uploadFile = this.uploadFile.bind(this);
    }

    async upload(file) {
        const fileName = uuid.v4() + '.jpg';
        await this.storage.bucket(this.bucketName).file(fileName).save(file.buffer);
        await this.storage.bucket(this.bucketName).file(fileName).makePublic();
        return `${this.baseUrl}${fileName}`;
    }

    async uploadFile(file, name) {
        const fileName = name;
        await this.storage.bucket(this.bucketName).file(fileName).save(file.buffer);
        await this.storage.bucket(this.bucketName).file(fileName).makePublic();
        return `${this.baseUrl}${fileName}`;
    }
}

module.exports = StorageService;