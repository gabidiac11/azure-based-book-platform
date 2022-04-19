const { BlobServiceClient, ContainerClient } = require("@azure/storage-blob");
const uuid = require("uuid");

class StorageService {
  static inject = ["Configuration"];
  constructor(config) {
    //set config details
    const storageConfig = config.get("AZURE_STORAGE");
    this.accountName = storageConfig.AZURE_ACCOUNT;
    this.containerName = storageConfig.AZURE_BLOB_CONTAINER;

    //set blob client
    /** @type {ContainerClient} */
    this.container = BlobServiceClient.fromConnectionString(
      storageConfig.AZURE_STORAGE_CONN_STRING
    ).getContainerClient(this.containerName);

    this.upload = this.upload.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
  }

  async upload(file) {
    const fileName = uuid.v4() + ".jpg";
    return await this.uploadFile(file, fileName);
  }

  async uploadFile(file, fileName) {
    await this.container.getBlockBlobClient(fileName).uploadData(file.buffer);
    return `https://${this.accountName}.blob.core.windows.net/${this.containerName}/${fileName}`;
  }
}

module.exports = StorageService;
