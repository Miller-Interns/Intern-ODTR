// server/types/h3.d.ts

// This imports your existing RequestContext type
import { RequestContext } from './RequestContext'

// This tells TypeScript that every H3EventContext in your project
// will also have the properties defined in your RequestContext.
declare module 'h3' {
  interface H3EventContext extends RequestContext {}
}