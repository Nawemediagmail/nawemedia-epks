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

  try {
    const filePath = `djs/${slug}/epk-data.json`
    const githubUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`

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
    }

    // Convert data to base64
    const base64Content = Buffer.from(JSON.stringify(data, null, 2)).toString("base64")

    const commitBody = {
      message: `chore: update ${slug} EPK data`,
      content: base64Content,
      branch: "main",
    }
    if (sha) commitBody.sha = sha

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

    if (!saveResponse.ok) {
      const error = await saveResponse.json()
      return res.status(saveResponse.status).json({ error: error.message || "GitHub API error" })
    }

    const result = await saveResponse.json()
    return res.status(200).json({ success: true, sha: result.content.sha })
  } catch (error) {
    return res.status(500).json({ error: error.message || "Unknown error" })
  }
}
