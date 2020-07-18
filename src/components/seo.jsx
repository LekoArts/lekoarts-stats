import React from 'react'
import { Helmet } from 'react-helmet'

const SEO = ({ meta }) => (
  <Helmet>
    <html lang="en" />
    <title>{meta.title}</title>
    <meta name="description" content={meta.description} />
    <meta name="og:title" content={meta.title} />
    <meta name="og:url" content={meta.url} />
    <meta name="og:description" content={meta.description} />
    <meta name="og:image" content={`${meta.url}${meta.image}`} />
    <meta property="og:type" content="website" />
    <meta property="og:image:alt" content={meta.description} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={meta.title} />
    <meta name="twitter:url" content={meta.url} />
    <meta name="twitter:description" content={meta.description} />
    <meta name="twitter:image" content={`${meta.url}${meta.image}`} />
    <meta name="twitter:image:alt" content={meta.description} />
    <meta name="twitter:creator" content={meta.author} />
  </Helmet>
)

export default SEO
