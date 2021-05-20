const unified = require('unified')
const markdown = require('remark-parse')
const emoji = require('remark-gemoji-to-emoji')
const remark2rehype = require('remark-rehype')
const raw = require('rehype-raw')
const slug = require('rehype-slug')
const autolinkHeadings = require('rehype-autolink-headings')
const highlight = require('rehype-highlight')
const html = require('rehype-stringify')
const graphql = require('highlightjs-graphql').definer
const remarkCodeExtra = require('remark-code-extra')
const codeHeader = require('./plugins/code-header')
const rewriteLocalLinks = require('./plugins/rewrite-local-links')
const useEnglishHeadings = require('./plugins/use-english-headings')
const rewriteAssetPathsToS3 = require('./plugins/rewrite-asset-paths-to-s3')
const wrapInElement = require('./plugins/wrap-in-element')

module.exports = function createProcessor (context) {
  return unified()
    .use(markdown)
    .use(remarkCodeExtra, { transform: codeHeader })
    .use(emoji)
    .use(remark2rehype, { allowDangerousHTML: true })
    .use(slug)
    .use(useEnglishHeadings, context)
    .use(autolinkHeadings, { behavior: 'wrap' })
    .use(highlight, { languages: { graphql }, subset: false })
    .use(raw)
    .use(rewriteAssetPathsToS3, context)
    .use(wrapInElement, { selector: 'ol > li img', wrapper: 'div.procedural-image-wrapper' })
    .use(rewriteLocalLinks, { languageCode: context.currentLanguage, version: context.currentVersion })
    .use(html)
}