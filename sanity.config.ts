import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemaTypes'

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID || 'tophwrez';
const dataset = import.meta.env.VITE_SANITY_DATASET || 'production';
export default defineConfig({
  name: 'studio',
  title: 'Reteabity',
  projectId: projectId,
  dataset: dataset,
  basePath: '/studio',
  plugins: [deskTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
