import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'jaxstreetcre',

  projectId: 'smzr73s0',
  dataset: 'real-data',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
