import { json, type LoaderArgs } from '@remix-run/node'
import { Nav } from '~/components/Nav'
import { sessionStorage } from '~/session.server'

export async function loader({ request }: LoaderArgs) {
  console.log('hello from one')
  const cookie = request.headers.get('Cookie')
  const getSetCookie = request.headers.getSetCookie()
  console.log('getSetCookie works', 'https://github.com/honojs/node-server/issues/58', getSetCookie)

  const session = await sessionStorage.getSession(cookie)
  session.set('hello', 'world')

  return json('ok', {
    headers: [['Set-Cookie', await sessionStorage.commitSession(session)]],
  })
}

export default function IndexRoute() {
  return (
    <div>
      <Nav />
      <p>Home</p>
      <b>Use the latest NodeJS version: 18 LTS or 20</b>
    </div>
  )
}
