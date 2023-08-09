import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://riilepuwgwmvlrqvpwoe.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpaWxlcHV3Z3dtdmxycXZwd29lIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODQ5MjI5MDMsImV4cCI6MjAwMDQ5ODkwM30.EtEtht4eOPdf2_Zp-3o9oAOX-vYs5xPKFnrmJKRpsVA'

const supabase = createClient(supabaseUrl, supabaseAnonKey)
export default supabase