#!/usr/bin/env node
import { migrateDataToDatabase } from '../lib/migration'
import { checkDatabaseConnection, disconnectDatabase } from '../lib/db'

async function main() {
  console.log('🚀 Starting migration to AWS RDS PostgreSQL...')
  
  try {
    // Check database connection
    const isConnected = await checkDatabaseConnection()
    if (!isConnected) {
      console.error('❌ Failed to connect to database. Please check your DATABASE_URL.')
      process.exit(1)
    }
    
    // Run migration
    const success = await migrateDataToDatabase()
    
    if (success) {
      console.log('✅ Migration completed successfully!')
      console.log('📝 Next steps:')
      console.log('1. Update your application to use the new database APIs')
      console.log('2. Test all functionality')
      console.log('3. Remove localStorage dependencies')
    } else {
      console.error('❌ Migration failed. Please check the logs above.')
      process.exit(1)
    }
  } catch (error) {
    console.error('❌ Unexpected error:', error)
    process.exit(1)
  } finally {
    await disconnectDatabase()
  }
}

// Run the migration
main().catch(console.error)