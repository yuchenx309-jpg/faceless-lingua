import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tahibqxsippsdpwoehrk.supabase.co'
const supabaseAnonKey = 'sb_publishable_3q8sIrxHMkB1YC_-w0poaQ_G4G8lsUx'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)