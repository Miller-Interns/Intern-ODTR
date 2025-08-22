import { RequestContext } from '../../types/RequestContext'
declare module 'h3' {
	interface H3EventContext extends RequestContext { }
}
