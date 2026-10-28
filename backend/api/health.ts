import { sendJson, withApi } from '../src/http.js'
import { getSupabase } from '../src/supabase.js'

export default withApi(['GET'], async (_req, res) => {
  let database: 'ok' | 'unavailable' = 'unavailable'

  try {
    const { error } = await getSupabase()
      .from('profile')
      .select('id', { head: true, count: 'exact' })
      .eq('id', 1)
      .limit(1)

    if (!error) {
      database = 'ok'
    } else {
      console.error('[health] database check failed:', error.message)
    }
  } catch (error) {
    console.error('[health] database check failed:', error)
  }

  const healthy = database === 'ok'

  sendJson(res, healthy ? 200 : 503, {
    status: healthy ? 'ok' : 'degraded',
    service: 'hikkammm-api',
    version: '1.0.0',
    database,
    timestamp: new Date().toISOString(),
  })
})
