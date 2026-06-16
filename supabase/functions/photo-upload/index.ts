import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const GITHUB_TOKEN = Deno.env.get("GITHUB_TOKEN") || ""
const GITHUB_OWNER = "Nawemediagmail"
const GITHUB_REPO = "nawemedia-epks"

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    })
  }

  try {
    const { fileData, fileName, slug } = await req.json()

    if (!fileData || !fileName || !slug) {
      return new Response(
        JSON.stringify({ error: "Missing fileData, fileName, or slug" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    }

    // Construct path in GitHub
    const filePath = `djs/${slug}/assets/${fileName}`

    // GitHub API call to upload file
    const githubUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`

    const response = await fetch(githubUrl, {
      method: "PUT",
      headers: {
        "Authorization": `token ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "NAWEMEDIA-EPK-Upload",
      },
      body: JSON.stringify({
        message: `feat: add photo ${fileName} to ${slug} EPK gallery`,
        content: fileData, // base64 encoded
        branch: "main",
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      return new Response(
        JSON.stringify({ error: error.message || "GitHub API error" }),
        { status: response.status, headers: { "Content-Type": "application/json" } }
      )
    }

    const result = await response.json()

    // Return public GitHub raw URL
    const publicUrl = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/main/${filePath}`

    return new Response(
      JSON.stringify({ success: true, url: publicUrl, sha: result.content.sha }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
})
