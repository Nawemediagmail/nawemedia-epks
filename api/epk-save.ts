import { VercelRequest, VercelResponse } from "@vercel/node"

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || ""
const GITHUB_OWNER = "Nawemediagmail"
const GITHUB_REPO = "nawemedia-epks"

export default async function handler(req: VercelRequest, res: VercelResponse) {
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

    // First, try to get the current file to get its SHA (required for updates)
    let sha: string | null = null
    try {
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
    } catch {
      // File doesn't exist yet, that's fine
    }

    // Convert data to base64
    const base64Content = Buffer.from(JSON.stringify(data, null, 2)).toString("base64")

    // Prepare the commit body
    const commitBody: Record<string, unknown> = {
      message: `chore: update ${slug} EPK data`,
      content: base64Content,
      branch: "main",
    }

    if (sha) {
      commitBody.sha = sha
    }

    // Save to GitHub
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

    return res.status(200).json({ success: true, data, sha: result.content.sha })
  } catch (error) {
    return res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" })
  }
}
