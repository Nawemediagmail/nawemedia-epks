import { VercelRequest, VercelResponse } from "@vercel/node"

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || ""
const GITHUB_OWNER = "Nawemediagmail"
const GITHUB_REPO = "nawemedia-epks"
const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const { fileData, fileName, slug } = req.body

    if (!fileData || !fileName || !slug) {
      return res.status(400).json({ error: "Missing fileData, fileName, or slug" })
    }

    // Validate file size (base64 encoded is ~33% larger than binary)
    const fileSizeBytes = Math.ceil((fileData.length * 3) / 4)
    if (fileSizeBytes > MAX_FILE_SIZE) {
      return res.status(413).json({
        error: `File size (${(fileSizeBytes / 1024 / 1024).toFixed(2)}MB) exceeds 2MB limit`,
      })
    }

    // Construct path in GitHub
    const filePath = `djs/${slug}/assets/${fileName}`

    // GitHub API call to upload file
    const githubUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`

    const response = await fetch(githubUrl, {
      method: "PUT",
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
        Accept: "application/vnd.github.v3+json",
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
      return res.status(response.status).json({ error: error.message || "GitHub API error" })
    }

    const result = await response.json()

    // Return public GitHub raw URL
    const publicUrl = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/main/${filePath}`

    return res.status(200).json({ success: true, url: publicUrl, sha: result.content.sha })
  } catch (error) {
    return res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" })
  }
}
