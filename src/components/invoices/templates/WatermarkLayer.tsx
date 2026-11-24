import React from "react"
import { View, Text, Image, StyleSheet } from "@react-pdf/renderer"
import { DesignSettings } from "@/lib/design-system/schema"
import { getFontFamilyBold } from "./font-utils"

interface WatermarkLayerProps {
  ds: DesignSettings
  companyLogo?: string
  companyName?: string
}

export function WatermarkLayer({
  ds,
  companyLogo,
  companyName,
}: WatermarkLayerProps) {
  const wm: any = ds.watermark || {}

  // 1. NO WATERMARK / DISABLED
  if (
    wm.enabled === false ||
    wm.mode === "NONE" ||
    wm.mode === "no_watermark" ||
    wm.type === "NONE"
  ) {
    return null
  }

  // Normalize mode
  let mode: string = (wm.mode || wm.type || "SINGLE_LOGO").toUpperCase()
  if (mode === "LOGO") mode = "SINGLE_LOGO"
  if (mode === "TEXT") mode = "SINGLE_TEXT"

  // Values normalized with professional defaults
  const opacity =
    typeof wm.opacity === "number"
      ? Math.max(0.01, Math.min(wm.opacity, 0.4))
      : wm.logo?.opacity ?? 0.06

  const rawSize = typeof wm.size === "number" ? wm.size : wm.logo?.size ?? 220
  const size = Math.max(50, Math.min(rawSize, 400))

  const rotation =
    typeof wm.rotation === "number"
      ? wm.rotation
      : mode === "SINGLE_LOGO"
      ? 0
      : -30

  const gap = typeof wm.gap === "number" ? Math.max(40, wm.gap) : 80

  const logoSrc = wm.logo?.url || companyLogo || ""
  const textContent = (
    wm.text?.content ||
    companyName ||
    "TIMES DIGITALS"
  ).toUpperCase()
  const textColor = wm.text?.color || "#0f172a"
  const fontFamily = getFontFamilyBold(
    wm.text?.fontFamily || ds.typography?.fontFamily
  )

  // 2. SINGLE LOGO (Centered large executive watermark)
  if (mode === "SINGLE_LOGO") {
    if (!logoSrc) {
      // Fallback to Single Text if no logo image is available
      return (
        <View style={styles.fullscreenFixed} fixed>
          <View style={styles.centerContainer}>
            <Text
              style={[
                styles.singleText,
                {
                  fontSize: Math.min(Math.max(Math.round(size * 0.22), 24), 54),
                  opacity,
                  color: textColor,
                  fontFamily,
                  transform: `rotate(${rotation || -30}deg)`,
                },
              ]}
            >
              {textContent}
            </Text>
          </View>
        </View>
      )
    }

    return (
      <View style={styles.fullscreenFixed} fixed>
        <View style={styles.centerContainer}>
          <Image
            src={logoSrc}
            style={{
              width: Math.min(size, 320),
              height: "auto",
              maxHeight: 280,
              opacity,
              objectFit: "contain",
              transform: rotation ? `rotate(${rotation}deg)` : undefined,
            }}
          />
        </View>
      </View>
    )
  }

  // 3. SINGLE TEXT (Centered large corporate watermark e.g. ORIGINAL, PAID, CONFIDENTIAL)
  if (mode === "SINGLE_TEXT") {
    const fontSize = Math.min(Math.max(Math.round(size * 0.24), 22), 56)
    return (
      <View style={styles.fullscreenFixed} fixed>
        <View style={styles.centerContainer}>
          <Text
            style={[
              styles.singleText,
              {
                fontSize,
                opacity,
                color: textColor,
                fontFamily,
                transform: `rotate(${rotation}deg)`,
              },
            ]}
          >
            {textContent}
          </Text>
        </View>
      </View>
    )
  }

  // 4. LOGO TILING (Staggered repeating matrix of logos across page)
  if (mode === "LOGO_TILING") {
    const tileSize = Math.min(Math.max(Math.round(size * 0.18), 24), 56)
    const xStep = Math.max(75, gap + 25)
    const yStep = Math.max(70, gap + 20)
    const cols = Math.ceil(620 / xStep) + 1
    const rows = Math.ceil(860 / yStep) + 1
    const tiles: React.ReactElement[] = []

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const stagger = r % 2 === 1 ? Math.round(xStep / 2) : 0
        const left = c * xStep + stagger - 25
        const top = r * yStep - 20

        if (logoSrc) {
          tiles.push(
            <Image
              key={`wm-logo-${r}-${c}`}
              src={logoSrc}
              style={{
                position: "absolute",
                left,
                top,
                width: tileSize,
                height: "auto",
                opacity,
                objectFit: "contain",
                transform: rotation ? `rotate(${rotation}deg)` : undefined,
              }}
            />
          )
        } else {
          tiles.push(
            <Text
              key={`wm-ltxt-${r}-${c}`}
              style={{
                position: "absolute",
                left,
                top,
                fontSize: 10,
                opacity,
                color: textColor,
                fontFamily,
                transform: `rotate(${rotation || -25}deg)`,
                letterSpacing: 1,
              }}
            >
              {textContent}
            </Text>
          )
        }
      }
    }

    return (
      <View style={styles.fullscreenFixed} fixed>
        {tiles}
      </View>
    )
  }

  // 5. TEXT TILING (Staggered repeating diagonal security text across page)
  if (mode === "TEXT_TILING") {
    const fontSize = Math.min(Math.max(Math.round(size * 0.07), 9), 16)
    const xStep = Math.max(85, gap + 30)
    const yStep = Math.max(60, gap + 15)
    const cols = Math.ceil(620 / xStep) + 1
    const rows = Math.ceil(860 / yStep) + 1
    const tiles: React.ReactElement[] = []

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const stagger = r % 2 === 1 ? Math.round(xStep / 2) : 0
        const left = c * xStep + stagger - 30
        const top = r * yStep - 15

        tiles.push(
          <Text
            key={`wm-txt-${r}-${c}`}
            style={{
              position: "absolute",
              left,
              top,
              fontSize,
              opacity,
              color: textColor,
              fontFamily,
              transform: `rotate(${rotation || -28}deg)`,
              letterSpacing: 1.5,
            }}
          >
            {textContent}
          </Text>
        )
      }
    }

    return (
      <View style={styles.fullscreenFixed} fixed>
        {tiles}
      </View>
    )
  }

  return null
}

const styles = StyleSheet.create({
  fullscreenFixed: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
    overflow: "hidden",
  },
  centerContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  singleText: {
    letterSpacing: 4,
    textTransform: "uppercase",
    textAlign: "center",
    fontWeight: "bold",
  },
})
