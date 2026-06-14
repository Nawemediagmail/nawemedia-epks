import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const supabaseUrl = Deno.env.get("SUPABASE_URL") || ""
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""

const supabase = createClient(supabaseUrl, supabaseKey)

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    })
  }

  const { slug, data } = await req.json()

  if (!slug || !data) {
    return new Response(JSON.stringify({ error: "Missing slug or data" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }

  const { data: result, error } = await supabase
    .from("epk_data")
    .upsert({ slug, data }, { onConflict: "slug" })
    .select()

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }

  return new Response(JSON.stringify({ success: true, data: result }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  })
})
