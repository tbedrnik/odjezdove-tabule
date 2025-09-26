import path from 'node:path'
import url from 'node:url'

import { options } from 'adonis-autoswagger/dist/types.js'

import pck from '../package.json' assert { type: 'json' }

export default {
  path: path.dirname(url.fileURLToPath(import.meta.url)) + '/../',
  tagIndex: 2,
  info: {
    title: pck.name,
    version: pck.version,
    description: 'description' in pck ? pck.description : undefined,
  },
  snakeCase: true,
  debug: true,
  ignore: ['/api/swagger', '/api/docs', '/app'],
  preferredPutPatch: 'PUT',
  common: {
    parameters: {},
    headers: {},
  },
  securitySchemes: {},
  authMiddlewares: ['auth', 'guest'],
  defaultSecurityScheme: 'BearerAuth',
  persistAuthorization: true,
} satisfies options
