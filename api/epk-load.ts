import { VercelRequest, VercelResponse } from "@vercel/node"

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || ""
const GITHUB_OWNER = "Nawemediagmail"
const GITHUB_REPO = "nawemedia-epks"

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const { slug } = req.query

  if (!slug) {
    return res.status(400).json({ error: "Missing slug parameter" })
  }

  try {
    // Fetch EPK data from GitHub
    const filePath = `djs/${slug}/epk-data.json`
    const githubUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`

    const response = await fetch(githubUrl, {
      method: "GET",
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3.raw+json",
        "User-Agent": "NAWEMEDIA-EPK-Load",
      },
    })

    if (response.status === 404) {
      // File doesn't exist yet, return default data structure
      return res.status(200).json({
        data: {
          bio: { en: "", es: "", de: "" },
          music: [],
          video: { url: "", title: "" },
          shows: [],
          gallery: [],
          socials: [],
          stats: { toques: "", paises: "", activo_desde: "" },
          artist: { name: "", tagline: "", location: "", genres: [], contact: "", whatsapp: "" },
        },
      })
    }

    if (!response.ok) {
      return res.status(500).json({ error: "Failed to fetch EPK data from GitHub" })
    }

    const data = await response.json()

    return res.status(200).json({ data })
  } catch (error) {
    return res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" })
  }
}
