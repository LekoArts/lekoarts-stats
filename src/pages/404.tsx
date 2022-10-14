import * as React from 'react'
import type { HeadFC } from 'gatsby'

const NotFound = () => {
  return <main>We couldn't find the page you're looking for!</main>
}

export default NotFound

export const Head: HeadFC = () => <title>404 - Not Found</title>
