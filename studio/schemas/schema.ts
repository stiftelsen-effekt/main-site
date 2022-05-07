// First, we must import the schema creator
import createSchema from 'part:@sanity/base/schema-creator'

// Then import schema types from any plugins that might expose them
import schemaTypes from 'all:part:@sanity/base/schema-type'
import about from './about'
import contributor from './contributor'
import frontpage from './frontpage'
import keyPoint from './key-point'
import organization from './organization'
import organizations from './organizations'
import profile from './profile'
import role from './role'
import testimonial from './testimonial'
import teaser from './teaser'

// Then we give our schema to the builder and provide the result to Sanity
export default createSchema({
  // We name our schema
  name: 'default',
  // Then proceed to concatenate our document type
  // to the ones provided by any plugins that are installed
  types: schemaTypes.concat([
    about,
    contributor,
    frontpage,
    keyPoint,
    organization,
    organizations,
    profile,
    role,
    testimonial,
    teaser
  ]),
})
