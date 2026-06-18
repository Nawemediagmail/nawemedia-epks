const GITHUB_TOKEN = process.env.GITHUB_TOKEN || ""
const GITHUB_OWNER = "Nawemediagmail"
const GITHUB_REPO = "nawemedia-epks"

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*")

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const { slug } = req.query

  if (!slug) {
    return res.status(400).json({ error: "Missing slug parameter" })
  }

  try {
    const filePath = `djs/${slug}/epk-data.json`
    const githubUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`

    const response = await fetch(githubUrl, {
      method: "GET",
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3.raw",
        "User-Agent": "NAWEMEDIA-EPK-Load",
      },
    })

    if (response.status === 404) {
      return res.status(200).json({ data: null })
    }

    if (!response.ok) {
      return res.status(500).json({ error: "Failed to fetch EPK data from GitHub" })
    }

    const data = await response.json()
    return res.status(200).json({ data })
  } catch (error) {
    return res.status(500).json({ error: error.message || "Unknown error" })
  }
}
