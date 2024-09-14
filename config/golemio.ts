import env from '#start/env'
import { Secret } from '@adonisjs/core/helpers'

export const golemioToken = new Secret(env.get('GOLEMIO_TOKEN'))
