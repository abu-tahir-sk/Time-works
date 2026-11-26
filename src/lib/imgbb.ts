/**
 * ImgBB Image Upload Utility
 * Uses ImgBB REST API (v1) to host images without external SDKs.
 * Documentation: https://api.imgbb.com/
 */

export interface ImgBBUploadResponse {
  success: boolean
  url?: string
  error?: string
}

/**
 * Uploads a base64 encoded image or Data URL to ImgBB.
 *
 * @param imageInput - Base64 string or Data URL (e.g., "data:image/png;base64,...")
 * @param name - Optional filename or title for the image
 * @returns Uploaded public URL or null if failed
 */
export async function uploadToImgBB(
  imageInput: string,
  name?: string
): Promise<string | null> {
  const apiKey = process.env.IMGBB_API_KEY

  if (!apiKey || apiKey === "your_imgbb_api_key_here") {
    console.warn(
      "[ImgBB] API key is missing or not configured. Set IMGBB_API_KEY in your environment (.env)."
    )
    return null
  }

  if (!imageInput) {
    console.warn("[ImgBB] No image input provided.")
    return null
  }

  try {
    // If input is a Data URL, strip the prefix "data:image/...;base64,"
    let base64Payload = imageInput
    if (imageInput.includes("base64,")) {
      base64Payload = imageInput.split("base64,")[1]
    }

    const formData = new FormData()
    formData.append("image", base64Payload)
    if (name) {
      formData.append("name", name)
    }

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`[ImgBB] Upload failed with status ${response.status}:`, errorText)
      return null
    }

    const json = await response.json()

    if (json?.success && (json?.data?.display_url || json?.data?.url)) {
      const publicUrl = json.data.display_url || json.data.url
      return publicUrl
    }

    console.error("[ImgBB] Unexpected API response format:", json)
    return null
  } catch (error) {
    console.error("[ImgBB] Error during image upload:", error)
    return null
  }
}
