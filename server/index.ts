import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import * as build from '@remix-run/dev/server-build'
import { broadcastDevReady } from '@remix-run/node'
import type { MiddlewareHandler } from 'hono'
import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { remix } from 'remix-hono/handler'

const NODE_ENV = process.env.NODE_ENV === 'production' ? 'production' : 'development'

/* Hono envs used with ctx.env */
type Bindings = {}

/* Hono variables used with ctx.get/ctx.set */
type Variables = {}

type ContextEnv = { Bindings: Bindings; Variables: Variables }

const app = new Hono<ContextEnv>()

// cache hashed assets for 1y
app.use('/build/*', cache(60 * 60 * 24 * 365), serveStatic({ root: './public', index: '' }))

// cache other assets for 1 hour
app.use('/static/*', cache(60 * 60), serveStatic({ root: './public', index: '' }))

// log non-static requests
app.use('*', logger())

// pass to remix
app.use(
  '*',
  remix({
    build,
    mode: NODE_ENV,
    getLoadContext(ctx) {
      return ctx.env
    },
  })
)

// start app, broadcast devReady in dev mode
serve(app, (info) => {
  console.log(`Listening on http://localhost:${info.port}`) // Listening on http://localhost:3000

  if (NODE_ENV === 'development') {
    broadcastDevReady(build)
  }
})

// add cache header to the response
function cache(seconds: number): MiddlewareHandler {
  return async function setCache(c, next) {
    await next()
    c.res.headers.set('cache-control', `public, max-age=${seconds}`)
  }
}
