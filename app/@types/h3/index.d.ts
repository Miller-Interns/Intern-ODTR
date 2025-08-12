// eslint-disable-next-line @typescript-eslint/no-unused-vars

import { RequestContext } from '../../types/RequestContext'
declare module 'h3' {
	// eslint-disable-next-line @typescript-eslint/no-empty-interface
	interface H3EventContext extends RequestContext {}
}
