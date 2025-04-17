import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListBucketsCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'

class S3ClientWrapper {
  private client: S3Client

  constructor() {
    this.client = new S3Client({
      region: 'auto',
      endpoint: process.env.R2_ENDPOINT,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      },
    })
  }

  async listBuckets() {
    try {
      const response = await this.client.send(new ListBucketsCommand({}))

      return response.Buckets || []
    } catch (error) {
      console.error('Erro ao listar buckets:', error)

      throw error
    }
  }

  async uploadFile(
    bucketName: string,
    fileKey: string,
    fileContent: Buffer,
    contentType: string,
  ) {
    try {
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: fileKey,
        Body: fileContent,
        ContentType: contentType,
      })

      const response = await this.client.send(command)

      return response
    } catch (error) {
      console.error('Erro ao enviar arquivo:', error)

      throw error
    }
  }

  async deleteFile(bucketName: string, fileKey: string) {
    try {
      const command = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: fileKey,
      })

      const response = await this.client.send(command)

      return response
    } catch (error) {
      console.error('Erro ao deletar arquivo:', error)

      throw error
    }
  }

  async getFile(bucketName: string, fileKey: string) {
    try {
      const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: fileKey,
      })

      const response = await this.client.send(command)

      return response.Body
    } catch (error) {
      console.error('Erro ao obter arquivo:', error)

      throw error
    }
  }
}

export default S3ClientWrapper
