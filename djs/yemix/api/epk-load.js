import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_ANON_KEY || "";

const supabase = createClient(supabaseUrl, supabaseKey);

export default async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { slug } = req.query;

  if (!slug) {
    return res.status(400).json({ error: "Missing slug parameter" });
  }

  try {
    const { data, error } = await supabase
      .from("epk")
      .select("data, updated_at")
      .eq("slug", slug)
      .single();

    if (error) {
      return res.status(404).json({ error: error.message });
    }

    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
