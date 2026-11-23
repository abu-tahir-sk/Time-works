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
} from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type WatermarkType = "SINGLE_LOGO" | "LOGO_TILING" | "SINGLE_TEXT" | "TEXT_TILING"

const PRESET_TEXT_COLORS = [
  { name: "Slate", hex: "#0f172a" },
  { name: "Blue", hex: "#2563eb" },
  { name: "Red", hex: "#dc2626" },
  { name: "Emerald", hex: "#059669" },
  { name: "Purple", hex: "#7c3aed" },
]

export function WatermarkSettings() {
  const form = useFormContext()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const watermark = form.watch("designSettings.watermark") || {}
  const companyLogo = form.watch("companyDetails.logoUrl") || ""
  const companyName = form.watch("companyDetails.name") || "DocuFlow"

  const isEnabled = watermark.enabled !== false && watermark.mode !== "NONE"
  const currentMode: WatermarkType =
    !watermark.mode || watermark.mode === "NONE" ? "SINGLE_LOGO" : (watermark.mode as WatermarkType)

  const currentOpacity = typeof watermark.opacity === "number" ? watermark.opacity : 0.05
  const opacityPct = Math.round(currentOpacity * 100)

  const currentSize = typeof watermark.size === "number" ? watermark.size : 220
  const currentRotation =
    typeof watermark.rotation === "number"
      ? watermark.rotation
      : currentMode === "SINGLE_LOGO"
      ? 0
      : -35

  const currentGap = typeof watermark.gap === "number" ? watermark.gap : 90
  const currentText = watermark.text?.content || companyName || "DocuFlow"
  const currentTextColor = watermark.text?.color || "#0f172a"
  const uploadedLogo = watermark.logo?.url || ""
  const effectiveLogo = uploadedLogo || companyLogo || ""

  // Toggle Enable / Disable
  const toggleEnabled = (checked: boolean) => {
    form.setValue("designSettings.watermark.enabled", checked, { shouldDirty: true })
    if (!checked) {
      form.setValue("designSettings.watermark.mode", "NONE", { shouldDirty: true })
    } else {
      form.setValue("designSettings.watermark.mode", currentMode || "SINGLE_LOGO", { shouldDirty: true })
    }
  }

  // Switch Type
  const setType = (type: WatermarkType) => {
    form.setValue("designSettings.watermark.enabled", true, { shouldDirty: true })
    form.setValue("designSettings.watermark.mode", type, { shouldDirty: true })
    if (type === "SINGLE_LOGO" || type === "LOGO_TILING") {
      form.setValue("designSettings.watermark.type", "LOGO", { shouldDirty: true })
      if (type === "SINGLE_LOGO" && currentRotation === -35) {
        form.setValue("designSettings.watermark.rotation", 0, { shouldDirty: true })
      }
    } else {
      form.setValue("designSettings.watermark.type", "TEXT", { shouldDirty: true })
      if (currentRotation === 0) {
        form.setValue("designSettings.watermark.rotation", -35, { shouldDirty: true })
      }
    }
  }

  // Sliders: Opacity, Size, Rotation, Gap ("tene tene barano komano")
  const setOpacity = (val: number) => {
    const decimal = Math.max(0.01, Math.min(1.0, val / 100))
    form.setValue("designSettings.watermark.opacity", decimal, { shouldDirty: true })
    form.setValue("designSettings.watermark.logo.opacity", decimal, { shouldDirty: true })
    form.setValue("designSettings.watermark.text.opacity", decimal, { shouldDirty: true })
  }

  const setSize = (val: number) => {
    form.setValue("designSettings.watermark.size", val, { shouldDirty: true })
    form.setValue("designSettings.watermark.logo.size", val, { shouldDirty: true })
  }

  const setRotation = (deg: number) => {
    form.setValue("designSettings.watermark.rotation", deg, { shouldDirty: true })
    form.setValue("designSettings.watermark.logo.rotation", deg, { shouldDirty: true })
    form.setValue("designSettings.watermark.text.rotation", deg, { shouldDirty: true })
  }

  const setGap = (px: number) => {
    form.setValue("designSettings.watermark.gap", px, { shouldDirty: true })
  }

  const setText = (val: string) => {
    form.setValue("designSettings.watermark.text.content", val, { shouldDirty: true })
  }

  const setTextColor = (hex: string) => {
    form.setValue("designSettings.watermark.text.color", hex, { shouldDirty: true })
  }

  // Upload Logo
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string
        form.setValue("designSettings.watermark.logo.url", base64, { shouldDirty: true })
      }
      reader.readAsDataURL(file)
    }
  }

  const removeUploadedLogo = () => {
    form.setValue("designSettings.watermark.logo.url", "", { shouldDirty: true })
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const isLogoMode = currentMode === "SINGLE_LOGO" || currentMode === "LOGO_TILING"
  const isTextMode = currentMode === "SINGLE_TEXT" || currentMode === "TEXT_TILING"
  const isTilingMode = currentMode === "LOGO_TILING" || currentMode === "TEXT_TILING"

  return (
    <div className="space-y-5 bg-card border rounded-xl p-4 md:p-5 shadow-sm">
      {/* 1. Header with Master On/Off Switch */}
      <div className="flex items-center justify-between pb-3 border-b">
        <div>
          <h4 className="text-sm font-semibold text-foreground">Watermark</h4>
          <p className="text-xs text-muted-foreground">
            Add a background logo or text watermark to your invoice
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="wm-active" className="text-xs text-muted-foreground cursor-pointer">
            {isEnabled ? "Enabled" : "Disabled"}
          </Label>
          <Switch id="wm-active" checked={isEnabled} onCheckedChange={toggleEnabled} />
        </div>
      </div>

      {!isEnabled ? (
        <div className="py-6 text-center text-xs text-muted-foreground border border-dashed rounded-lg bg-muted/20">
          Watermark is disabled. Turn on the switch above to add a watermark.
        </div>
      ) : (
        <div className="space-y-5">
          {/* 2. Type Selector Tabs / Buttons (Single Logo, Logo Tiling, Single Text, Text Tiling) */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">Watermark Type</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: "SINGLE_LOGO" as WatermarkType, label: "Single Logo" },
                { id: "LOGO_TILING" as WatermarkType, label: "Logo Tiling" },
                { id: "SINGLE_TEXT" as WatermarkType, label: "Single Text" },
                { id: "TEXT_TILING" as WatermarkType, label: "Text Tiling" },
              ].map((item) => {
                const active = currentMode === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setType(item.id)}
                    className={cn(
                      "py-2 px-3 text-xs font-medium rounded-lg border transition-all text-center",
                      active
                        ? "bg-primary text-primary-foreground border-primary shadow-sm font-semibold"
                        : "bg-muted/40 hover:bg-muted text-muted-foreground border-border hover:text-foreground"
                    )}
                  >
                    {item.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* 3. Logo Upload (when Logo mode is selected) */}
          {isLogoMode && (
            <div className="bg-muted/30 border rounded-lg p-3 space-y-2.5">
              <Label className="text-xs font-semibold flex items-center gap-1.5 text-foreground">
                <ImageIcon className="h-3.5 w-3.5 text-blue-500" />
                Watermark Logo
              </Label>
              <div className="flex items-center gap-3">
                <div className="h-14 w-20 shrink-0 rounded-md border-2 border-dashed bg-background flex items-center justify-center p-1 overflow-hidden">
                  {effectiveLogo ? (
                    <img src={effectiveLogo} alt="Logo" className="max-h-full max-w-full object-contain" />
                  ) : (
                    <span className="text-[10px] text-muted-foreground text-center">No logo</span>
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
                    {uploadedLogo ? "Change Logo" : "Upload Logo"}
                  </Button>
                  {uploadedLogo ? (
                    <button
                      type="button"
                      onClick={removeUploadedLogo}
                      className="text-[11px] text-destructive hover:underline text-left"
                    >
                      Remove custom logo
                    </button>
                  ) : companyLogo ? (
                    <span className="text-[11px] text-muted-foreground">
                      Using company profile logo
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          )}

          {/* 4. Text Input & Color (when Text mode is selected) */}
          {isTextMode && (
            <div className="bg-muted/30 border rounded-lg p-3 space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold flex items-center gap-1.5 text-foreground">
                  <Type className="h-3.5 w-3.5 text-blue-500" />
                  Watermark Text
                </Label>
                <Input
                  value={currentText}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="e.g. DocuFlow, CONFIDENTIAL, PAID, ORIGINAL"
                  className="h-9 text-xs bg-background"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">Text Color</Label>
                <div className="flex items-center gap-2">
                  {PRESET_TEXT_COLORS.map((col) => (
                    <button
                      key={col.name}
                      type="button"
                      onClick={() => setTextColor(col.hex)}
                      title={col.name}
                      className={cn(
                        "w-6 h-6 rounded-full border transition-transform hover:scale-110",
                        currentTextColor === col.hex ? "ring-2 ring-primary ring-offset-2 scale-105" : "border-border"
                      )}
                      style={{ backgroundColor: col.hex }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 5. Tene Barano / Komano Sliders */}
          <div className="space-y-4 pt-1">
            <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Adjust Sliders (টেনে বাড়ানো / কমানো)
            </h5>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Opacity Slider */}
              <div className="bg-muted/20 border rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold flex items-center gap-1 text-foreground">
                    <Droplets className="h-3.5 w-3.5 text-blue-500" />
                    Opacity
                  </span>
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                    {opacityPct}%
                  </span>
                </div>
                <Slider
                  value={[opacityPct]}
                  min={1}
                  max={40}
                  step={1}
                  onValueChange={(vals: any) => {
                    const num = Array.isArray(vals) ? vals[0] : Number(vals)
                    setOpacity(num)
                  }}
                />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>1% (Faint)</span>
                  <span>40% (Solid)</span>
                </div>
              </div>

              {/* Size Slider */}
              <div className="bg-muted/20 border rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold flex items-center gap-1 text-foreground">
                    <Maximize2 className="h-3.5 w-3.5 text-blue-500" />
                    Size / Scale
                  </span>
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                    {currentSize}px
                  </span>
                </div>
                <Slider
                  value={[currentSize]}
                  min={60}
                  max={420}
                  step={10}
                  onValueChange={(vals: any) => {
                    const num = Array.isArray(vals) ? vals[0] : Number(vals)
                    setSize(num)
                  }}
                />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>60px (Small)</span>
                  <span>420px (Large)</span>
                </div>
              </div>

              {/* Rotation Slider */}
              <div className="bg-muted/20 border rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold flex items-center gap-1 text-foreground">
                    <RotateCw className="h-3.5 w-3.5 text-blue-500" />
                    Rotation Angle
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setRotation(0)}
                      title="Reset to 0°"
                      className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-0.5"
                    >
                      <RotateCcw className="h-3 w-3" />
                      0°
                    </button>
                    <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
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
                  <span>0° (Straight)</span>
                  <span>+90°</span>
                </div>
              </div>

              {/* Tiling Gap / Density Slider (Only for tiling modes) */}
              {isTilingMode && (
                <div className="bg-muted/20 border rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold flex items-center gap-1 text-foreground">
                      <Grid className="h-3.5 w-3.5 text-blue-500" />
                      Tiling Spacing / Gap
                    </span>
                    <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                      {currentGap}px
                    </span>
                  </div>
                  <Slider
                    value={[currentGap]}
                    min={40}
                    max={180}
                    step={5}
                    onValueChange={(vals: any) => {
                      const num = Array.isArray(vals) ? vals[0] : Number(vals)
                      setGap(num)
                    }}
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>40px (Dense)</span>
                    <span>180px (Wide)</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
