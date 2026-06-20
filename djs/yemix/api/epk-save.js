import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const supabase = createClient(supabaseUrl, supabaseKey);

export default async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { slug, data } = req.body;

  if (!slug || !data) {
    return res.status(400).json({ error: "Missing slug or data" });
  }

  try {
    const { data: result, error } = await supabase
      .from("epk")
      .upsert({ slug, data }, { onConflict: "slug" })
      .select();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json({ success: true, data: result });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
