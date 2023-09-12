import { Link } from '@remix-run/react'

export function Nav() {
  return (
    <ul>
      <li>
        <Link to="/one">One</Link>
      </li>
      <li>
        <Link to="/two">Two</Link>
      </li>
      <li>
        <Link to="/not-found">Not found</Link>
      </li>
    </ul>
  )
}
