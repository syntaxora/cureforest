import { Pool, PoolClient, QueryResult, QueryResultRow } from "pg"

// Global connection pool (singleton pattern for serverless)
declare global {
  // eslint-disable-next-line no-var
  var pgPool: Pool | undefined
}

function getPool(): Pool {
  if (!global.pgPool) {
    const connectionString = process.env.DATABASE_URL
    
    if (!connectionString) {
      throw new Error(
        "DATABASE_URL environment variable is not set. " +
        "Please check your .env.local file or Vercel environment variables."
      )
    }

    global.pgPool = new Pool({
      connectionString,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    })

    // Handle pool errors
    global.pgPool.on("error", (err) => {
      console.error("Unexpected database pool error:", err)
    })
  }

  return global.pgPool
}

/**
 * Execute a query with automatic connection handling
 */
export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<QueryResult<T>> {
  const pool = getPool()
  const start = Date.now()
  
  try {
    const result = await pool.query<T>(text, params)
    const duration = Date.now() - start
    
    if (process.env.NODE_ENV === "development") {
      console.log("[DB] Query executed", { 
        text: text.substring(0, 100), 
        duration: `${duration}ms`,
        rows: result.rowCount 
      })
    }
    
    return result
  } catch (error) {
    console.error("[DB] Query error:", error)
    throw error
  }
}

/**
 * Get a client for transaction support
 */
export async function getClient(): Promise<PoolClient> {
  const pool = getPool()
  const client = await pool.connect()
  return client
}

/**
 * Execute multiple queries in a transaction
 */
export async function transaction<T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await getClient()
  
  try {
    await client.query("BEGIN")
    const result = await callback(client)
    await client.query("COMMIT")
    return result
  } catch (error) {
    await client.query("ROLLBACK")
    throw error
  } finally {
    client.release()
  }
}

/**
 * Health check for the database connection
 */
export async function healthCheck(): Promise<boolean> {
  try {
    const result = await query("SELECT 1 as ok")
    return result.rows[0]?.ok === 1
  } catch {
    return false
  }
}
