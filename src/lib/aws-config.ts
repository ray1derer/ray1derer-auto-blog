import { S3Client } from '@aws-sdk/client-s3'
import { SecretsManagerClient } from '@aws-sdk/client-secrets-manager'

// AWS S3 Client for media storage
export const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION || 'ap-northeast-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

// AWS Secrets Manager for secure credential storage
export const secretsClient = new SecretsManagerClient({
  region: process.env.AWS_REGION || 'ap-northeast-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

// S3 bucket configuration
export const S3_CONFIG = {
  bucketName: process.env.AWS_S3_BUCKET || 'ray1derer-blog-media',
  region: process.env.AWS_S3_REGION || 'ap-northeast-2',
  cloudFrontUrl: process.env.CLOUDFRONT_URL, // Optional CDN
}

// RDS configuration helper
export function getRDSConfig() {
  const isDevelopment = process.env.NODE_ENV === 'development'
  
  if (isDevelopment) {
    return {
      host: 'localhost',
      port: 5432,
      database: 'ray1derer_blog',
      username: 'postgres',
      password: 'password',
    }
  }
  
  // Production RDS configuration
  return {
    host: process.env.RDS_HOSTNAME,
    port: parseInt(process.env.RDS_PORT || '5432'),
    database: process.env.RDS_DB_NAME,
    username: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
  }
}