import { SessionData } from './SessionData.d.ts'
import type { Context, SessionFlavor } from 'grammy'

type MyContext = Context & SessionFlavor<SessionData>

export type { MyContext }
