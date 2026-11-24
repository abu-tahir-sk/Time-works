"use client"

import React, { useRef } from "react"
import { useFormContext } from "react-hook-form"
import {
  Droplets,
  Maximize2,
  RotateCw,
  Grid,
  Type,
  Upload,
  Image as ImageIcon,
  RotateCcw,
  Ban,
  Stamp,
  Layers,
} from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export type WatermarkType =
  | "NONE"
  | "SINGLE_LOGO"
  | "LOGO_TILING"
  | "SINGLE_TEXT"
  | "TEXT_TILING"

const PRESET_TEXT_COLORS = [
  { name: "Slate", hex: "#0f172a" },
  { name: "Times Works Crimson", hex: "#c82020" },
  { name: "Dark Navy", hex: "#1e3a8a" },
  { name: "Red", hex: "#dc2626" },
  { name: "Emerald", hex: "#059669" },
  { name: "Purple", hex: "#7c3aed" },
]

export function WatermarkSettings() {
  const form = useFormContext()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const watermark = form.watch("designSettings.watermark") || {}
  const companyLogo = form.watch("companyDetails.logoUrl") || ""
  const companyName = form.watch("companyDetails.name") || "Times Works"

  const isEnabled = watermark.enabled !== false && watermark.mode !== "NONE"
  const currentMode: WatermarkType = !isEnabled
    ? "NONE"
    : (watermark.mode as WatermarkType) || "SINGLE_LOGO"

  const currentOpacity =
    typeof watermark.opacity === "number" ? watermark.opacity : 0.06
  const opacityPct = Math.round(currentOpacity * 100)

  const currentSize =
    typeof watermark.size === "number" ? watermark.size : 220
  const currentRotation =
    typeof watermark.rotation === "number"
      ? watermark.rotation
      : currentMode === "SINGLE_LOGO"
      ? 0
      : -30

  const currentGap = typeof watermark.gap === "number" ? watermark.gap : 85
  const currentText = watermark.text?.content || companyName || "Times Works"
  const currentTextColor = watermark.text?.color || "#0f172a"
  const uploadedLogo = watermark.logo?.url || ""
  const effectiveLogo = uploadedLogo || companyLogo || ""

  // Toggle Enable / Disable
  const toggleEnabled = (checked: boolean) => {
    form.setValue("designSettings.watermark.enabled", checked, {
      shouldDirty: true,
    })
    if (!checked) {
      form.setValue("designSettings.watermark.mode", "NONE", {
        shouldDirty: true,
      })
    } else {
      form.setValue("designSettings.watermark.mode", "SINGLE_LOGO", {
        shouldDirty: true,
      })
    }
  }

  // Switch Type (including NONE)
  const setType = (type: WatermarkType) => {
    if (type === "NONE") {
      form.setValue("designSettings.watermark.enabled", false, {
        shouldDirty: true,
      })
      form.setValue("designSettings.watermark.mode", "NONE", {
        shouldDirty: true,
      })
      return
    }

    form.setValue("designSettings.watermark.enabled", true, {
      shouldDirty: true,
    })
    form.setValue("designSettings.watermark.mode", type, { shouldDirty: true })

    if (type === "SINGLE_LOGO" || type === "LOGO_TILING") {
      form.setValue("designSettings.watermark.type", "LOGO", {
        shouldDirty: true,
      })
      if (type === "SINGLE_LOGO" && currentRotation === -30) {
        form.setValue("designSettings.watermark.rotation", 0, {
          shouldDirty: true,
        })
      }
    } else {
      form.setValue("designSettings.watermark.type", "TEXT", {
        shouldDirty: true,
      })
      if (currentRotation === 0) {
        form.setValue("designSettings.watermark.rotation", -30, {
          shouldDirty: true,
        })
      }
    }
  }

  // Sliders: Opacity, Size, Rotation, Gap
  const setOpacity = (val: number) => {
    const decimal = Math.max(0.01, Math.min(0.5, val / 100))
    form.setValue("designSettings.watermark.opacity", decimal, {
      shouldDirty: true,
    })
    form.setValue("designSettings.watermark.logo.opacity", decimal, {
      shouldDirty: true,
    })
    form.setValue("designSettings.watermark.text.opacity", decimal, {
      shouldDirty: true,
    })
  }

  const setSize = (val: number) => {
    form.setValue("designSettings.watermark.size", val, { shouldDirty: true })
    form.setValue("designSettings.watermark.logo.size", val, {
      shouldDirty: true,
    })
  }

  const setRotation = (deg: number) => {
    form.setValue("designSettings.watermark.rotation", deg, {
      shouldDirty: true,
    })
    form.setValue("designSettings.watermark.logo.rotation", deg, {
      shouldDirty: true,
    })
    form.setValue("designSettings.watermark.text.rotation", deg, {
      shouldDirty: true,
    })
  }

  const setGap = (px: number) => {
    form.setValue("designSettings.watermark.gap", px, { shouldDirty: true })
  }

  const setText = (val: string) => {
    form.setValue("designSettings.watermark.text.content", val, {
      shouldDirty: true,
    })
  }

  const setTextColor = (hex: string) => {
    form.setValue("designSettings.watermark.text.color", hex, {
      shouldDirty: true,
    })
  }

  // Upload Logo
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string
        form.setValue("designSettings.watermark.logo.url", base64, {
          shouldDirty: true,
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const removeUploadedLogo = () => {
    form.setValue("designSettings.watermark.logo.url", "", {
      shouldDirty: true,
    })
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const isLogoMode =
    currentMode === "SINGLE_LOGO" || currentMode === "LOGO_TILING"
  const isTextMode =
    currentMode === "SINGLE_TEXT" || currentMode === "TEXT_TILING"
  const isTilingMode =
    currentMode === "LOGO_TILING" || currentMode === "TEXT_TILING"

  return (
    <Card className="p-4 md:p-5 border border-border/80 shadow-xs space-y-5 bg-card">
      {/* 1. Master Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border/70">
        <div>
          <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Stamp className="h-4 w-4 text-[#c82020]" />
            Document Watermark
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            Embed anti-counterfeit logos or text watermarks on your generated PDFs
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Label
            htmlFor="wm-active"
            className="text-xs text-muted-foreground cursor-pointer font-medium"
          >
            {isEnabled ? "Enabled" : "Disabled"}
          </Label>
          <Switch
            id="wm-active"
            checked={isEnabled}
            onCheckedChange={toggleEnabled}
          />
        </div>
      </div>

      {/* 2. 5-Button Mode Selector: No Watermark, Single Logo, Logo Tiling, Single Text, Text Tiling */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-foreground">
          Watermark Style
        </Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {[
            {
              id: "NONE" as WatermarkType,
              label: "No Watermark",
              icon: Ban,
            },
            {
              id: "SINGLE_LOGO" as WatermarkType,
              label: "Single Logo",
              icon: ImageIcon,
            },
            {
              id: "LOGO_TILING" as WatermarkType,
              label: "Logo Tiling",
              icon: Layers,
            },
            {
              id: "SINGLE_TEXT" as WatermarkType,
              label: "Single Text",
              icon: Type,
            },
            {
              id: "TEXT_TILING" as WatermarkType,
              label: "Text Tiling",
              icon: Grid,
            },
          ].map((item) => {
            const active = currentMode === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setType(item.id)}
                className={cn(
                  "py-2 px-2.5 text-xs font-medium rounded-md border transition-all text-center flex flex-col items-center justify-center gap-1.5",
                  active
                    ? "bg-[#c82020] text-white border-[#c82020] shadow-xs font-semibold"
                    : "bg-muted/40 hover:bg-muted text-muted-foreground border-border/80 hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span className="truncate">{item.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {currentMode === "NONE" ? (
        <div className="py-6 text-center text-xs text-muted-foreground border border-dashed rounded-lg bg-muted/10">
          No watermark will be printed on the invoice or quotation PDF.
        </div>
      ) : (
        <div className="space-y-4 pt-1">
          {/* 3. Logo Upload Block */}
          {isLogoMode && (
            <div className="bg-muted/20 border border-border/70 rounded-lg p-3 space-y-2.5">
              <Label className="text-xs font-semibold flex items-center gap-1.5 text-foreground">
                <ImageIcon className="h-3.5 w-3.5 text-[#c82020]" />
                Watermark Logo Source
              </Label>
              <div className="flex items-center gap-3">
                <div className="h-14 w-20 shrink-0 rounded-md border-2 border-dashed bg-background flex items-center justify-center p-1 overflow-hidden">
                  {effectiveLogo ? (
                    <img
                      src={effectiveLogo}
                      alt="Logo"
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <span className="text-[10px] text-muted-foreground text-center">
                      No logo
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs cursor-pointer gap-1.5 w-fit"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-3.5 w-3.5" />
                    {uploadedLogo ? "Change Watermark Logo" : "Upload Custom Logo"}
                  </Button>
                  {uploadedLogo ? (
                    <button
                      type="button"
                      onClick={removeUploadedLogo}
                      className="text-[11px] text-destructive hover:underline text-left cursor-pointer"
                    >
                      Reset to company logo
                    </button>
                  ) : companyLogo ? (
                    <span className="text-[11px] text-muted-foreground">
                      Using company profile logo
                    </span>
                  ) : (
                    <span className="text-[11px] text-muted-foreground">
                      Upload an image or company logo will be used
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 4. Text Input Block */}
          {isTextMode && (
            <div className="bg-muted/20 border border-border/70 rounded-lg p-3 space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold flex items-center gap-1.5 text-foreground">
                  <Type className="h-3.5 w-3.5 text-[#c82020]" />
                  Watermark Text
                </Label>
                <Input
                  value={currentText}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="e.g. Times Works, CONFIDENTIAL, PAID, ORIGINAL"
                  className="h-9 text-xs bg-background"
                />
              </div>

              {/* Quick Text Suggestions */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] text-muted-foreground">Quick:</span>
                {["ORIGINAL", "PAID", "CONFIDENTIAL", "DRAFT"].map((word) => (
                  <button
                    key={word}
                    type="button"
                    onClick={() => setText(word)}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded bg-muted hover:bg-muted/80 text-foreground border border-border/60 transition-colors"
                  >
                    {word}
                  </button>
                ))}
              </div>

              <div className="space-y-1.5 pt-1">
                <Label className="text-xs font-semibold text-foreground">
                  Text Color
                </Label>
                <div className="flex items-center gap-2">
                  {PRESET_TEXT_COLORS.map((col) => (
                    <button
                      key={col.name}
                      type="button"
                      onClick={() => setTextColor(col.hex)}
                      title={col.name}
                      className={cn(
                        "w-5.5 h-5.5 rounded-full border transition-transform hover:scale-110",
                        currentTextColor === col.hex
                          ? "ring-2 ring-[#c82020] ring-offset-2 scale-105"
                          : "border-border"
                      )}
                      style={{ backgroundColor: col.hex }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 5. Precision Sliders */}
          <div className="space-y-3 pt-1">
            <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Fine-tune Watermark
            </h5>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {/* Opacity Slider */}
              <div className="bg-muted/20 border border-border/70 rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold flex items-center gap-1 text-foreground">
                    <Droplets className="h-3.5 w-3.5 text-[#c82020]" />
                    Opacity
                  </span>
                  <span className="text-xs font-bold font-mono text-[#c82020] bg-[#c82020]/10 px-2 py-0.5 rounded">
                    {opacityPct}%
                  </span>
                </div>
                <Slider
                  value={[opacityPct]}
                  min={1}
                  max={35}
                  step={1}
                  onValueChange={(vals: any) => {
                    const num = Array.isArray(vals) ? vals[0] : Number(vals)
                    setOpacity(num)
                  }}
                />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>1% (Subtle)</span>
                  <span>10% (Balanced)</span>
                  <span>35% (Prominent)</span>
                </div>
              </div>

              {/* Size Slider */}
              <div className="bg-muted/20 border border-border/70 rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold flex items-center gap-1 text-foreground">
                    <Maximize2 className="h-3.5 w-3.5 text-[#c82020]" />
                    Scale / Size
                  </span>
                  <span className="text-xs font-bold font-mono text-[#c82020] bg-[#c82020]/10 px-2 py-0.5 rounded">
                    {currentSize}px
                  </span>
                </div>
                <Slider
                  value={[currentSize]}
                  min={60}
                  max={380}
                  step={10}
                  onValueChange={(vals: any) => {
                    const num = Array.isArray(vals) ? vals[0] : Number(vals)
                    setSize(num)
                  }}
                />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>60px</span>
                  <span>220px (Default)</span>
                  <span>380px</span>
                </div>
              </div>

              {/* Rotation Slider */}
              <div className="bg-muted/20 border border-border/70 rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold flex items-center gap-1 text-foreground">
                    <RotateCw className="h-3.5 w-3.5 text-[#c82020]" />
                    Rotation
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setRotation(0)}
                      title="Reset to 0°"
                      className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-0.5 cursor-pointer"
                    >
                      <RotateCcw className="h-3 w-3" />
                      0°
                    </button>
                    <span className="text-xs font-bold font-mono text-[#c82020] bg-[#c82020]/10 px-2 py-0.5 rounded">
                      {currentRotation}°
                    </span>
                  </div>
                </div>
                <Slider
                  value={[currentRotation]}
                  min={-90}
                  max={90}
                  step={5}
                  onValueChange={(vals: any) => {
                    const num = Array.isArray(vals) ? vals[0] : Number(vals)
                    setRotation(num)
                  }}
                />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>-90° (Vertical)</span>
                  <span>-30° (Diagonal)</span>
                  <span>0° (Straight)</span>
                </div>
              </div>

              {/* Tiling Gap Slider */}
              {isTilingMode && (
                <div className="bg-muted/20 border border-border/70 rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold flex items-center gap-1 text-foreground">
                      <Grid className="h-3.5 w-3.5 text-[#c82020]" />
                      Tile Spacing / Density
                    </span>
                    <span className="text-xs font-bold font-mono text-[#c82020] bg-[#c82020]/10 px-2 py-0.5 rounded">
                      {currentGap}px
                    </span>
                  </div>
                  <Slider
                    value={[currentGap]}
                    min={40}
                    max={160}
                    step={5}
                    onValueChange={(vals: any) => {
                      const num = Array.isArray(vals) ? vals[0] : Number(vals)
                      setGap(num)
                    }}
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>40px (Dense)</span>
                    <span>85px (Standard)</span>
                    <span>160px (Spread)</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
