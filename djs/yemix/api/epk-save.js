const GITHUB_TOKEN = process.env.GITHUB_TOKEN || ""
const GITHUB_OWNER = "Nawemediagmail"
const GITHUB_REPO = "nawemedia-epks"

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*")

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const { slug, data } = req.body

  if (!slug || !data) {
    return res.status(400).json({ error: "Missing slug or data" })
  }

  // Check if token is configured
  if (!GITHUB_TOKEN) {
    console.error("ERROR: GITHUB_TOKEN not configured in environment variables")
    return res.status(500).json({ error: "Server not configured: missing GITHUB_TOKEN" })
  }

  try {
    const filePath = `djs/${slug}/epk-data.json`
    const githubUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`

    console.log(`[epk-save] Attempting to save to: ${filePath}`)

    // Get current file SHA (required for updates)
    let sha = null
    const getResponse = await fetch(githubUrl, {
      method: "GET",
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "NAWEMEDIA-EPK-Save",
      },
    })

    if (getResponse.ok) {
      const fileInfo = await getResponse.json()
      sha = fileInfo.sha
      console.log(`[epk-save] Found existing file with SHA: ${sha}`)
    } else {
      console.log(`[epk-save] File not found (404) or error - will create new file`)
    }

    // Convert data to base64
    const jsonString = JSON.stringify(data, null, 2)
    const base64Content = Buffer.from(jsonString).toString("base64")
    console.log(`[epk-save] Data size: ${jsonString.length} bytes, base64: ${base64Content.length} bytes`)

    const commitBody = {
      message: `chore: update ${slug} EPK data`,
      content: base64Content,
      branch: "main",
    }
    if (sha) {
      commitBody.sha = sha
    }

    console.log(`[epk-save] Sending PUT request to GitHub API...`)

    const saveResponse = await fetch(githubUrl, {
      method: "PUT",
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "NAWEMEDIA-EPK-Save",
      },
      body: JSON.stringify(commitBody),
    })

    console.log(`[epk-save] GitHub response status: ${saveResponse.status}`)

    if (!saveResponse.ok) {
      const error = await saveResponse.json()
      console.error(`[epk-save] GitHub error: ${error.message}`)
      return res.status(saveResponse.status).json({ error: error.message || "GitHub API error" })
    }

    const result = await saveResponse.json()
    console.log(`[epk-save] Success! New SHA: ${result.content.sha}`)

    return res.status(200).json({ success: true, sha: result.content.sha })
  } catch (error) {
    console.error(`[epk-save] Exception: ${error.message}`)
    return res.status(500).json({ error: error.message || "Unknown error" })
  }
}
