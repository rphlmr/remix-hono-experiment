import { createCookieSessionStorage } from '@remix-run/node'

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: 'should-works',
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secrets: ['secret'],
    secure: process.env.NODE_ENV === 'production',
  },
})
