import { NextResponse } from "next/server"
import { requireUser } from "@/lib/auth/utils"
import { uploadToImgBB } from "@/lib/imgbb"

export async function POST(req: Request) {
  try {
    // Ensure user is authenticated before allowing upload
    await requireUser()

    const body = await req.json()
    const { image, name } = body

    if (!image) {
      return NextResponse.json(
        { success: false, error: "Image data is required" },
        { status: 400 }
      )
    }

    const url = await uploadToImgBB(image, name)

    if (!url) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Failed to upload image to ImgBB. Please ensure IMGBB_API_KEY is configured in your .env file.",
        },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, url })
  } catch (error: any) {
    console.error("Upload route error:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process image upload" },
      { status: 500 }
    )
  }
}
