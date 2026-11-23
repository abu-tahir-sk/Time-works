import React from 'react';
import { View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import { DesignSettings } from '@/lib/design-system/schema';
import { getFontFamilyBold } from './font-utils';

interface WatermarkLayerProps {
    ds: DesignSettings;
    companyLogo?: string;
    companyName?: string;
}

export function WatermarkLayer({ ds, companyLogo, companyName }: WatermarkLayerProps) {
    const wm: any = ds.watermark || {};

    // Check if watermark is explicitly disabled
    if (wm.enabled === false || wm.mode === 'NONE') {
        return null;
    }

    const mode = wm.mode || (wm.type === 'LOGO' ? 'SINGLE_LOGO' : 'SINGLE_LOGO');
    const opacity = typeof wm.opacity === 'number' ? wm.opacity : (wm.logo?.opacity ?? 0.05);
    const size = typeof wm.size === 'number' ? wm.size : (wm.logo?.size ?? 220);
    const rotation = typeof wm.rotation === 'number' ? wm.rotation : (mode === 'SINGLE_LOGO' ? 0 : -35);
    const gap = typeof wm.gap === 'number' ? wm.gap : 90;

    // Use custom uploaded watermark logo if available, otherwise company logo
    const logoSrc = wm.logo?.url || companyLogo || '';
    const textContent = wm.text?.content || companyName || 'DocuFlow';
    const textColor = wm.text?.color || '#0f172a';
    const fontFamily = getFontFamilyBold(wm.text?.fontFamily || ds.typography?.fontFamily);

    // 1. SINGLE LOGO (Centered large watermark, rotatable)
    if (mode === 'SINGLE_LOGO') {
        if (!logoSrc) {
            // Fallback to Single Text if no logo is available
            return (
                <View style={styles.fullscreenFixed} fixed>
                    <View style={styles.centerContainer}>
                        <Text
                            style={[
                                styles.singleText,
                                {
                                    fontSize: Math.min(Math.max(Math.round(size * 0.28), 28), 64),
                                    opacity,
                                    color: textColor,
                                    fontFamily,
                                    transform: `rotate(${rotation || -35}deg)`,
                                },
                            ]}
                        >
                            {textContent}
                        </Text>
                    </View>
                </View>
            );
        }

        return (
            <View style={styles.fullscreenFixed} fixed>
                <View style={styles.centerContainer}>
                    <Image
                        src={logoSrc}
                        style={{
                            width: Math.min(Math.max(size, 60), 340),
                            height: 'auto',
                            maxHeight: 300,
                            opacity,
                            objectFit: 'contain',
                            transform: rotation ? `rotate(${rotation}deg)` : undefined,
                        }}
                    />
                </View>
            </View>
        );
    }

    // 2. SINGLE TEXT (Centered large rotatable text)
    if (mode === 'SINGLE_TEXT') {
        const fontSize = Math.min(Math.max(Math.round(size * 0.26), 24), 64);
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
        );
    }

    // 3. LOGO TILING (Repeating staggered pattern of logos)
    if (mode === 'LOGO_TILING') {
        const tileSize = Math.min(Math.max(Math.round(size * 0.2), 24), 70);
        const xStep = Math.max(70, gap + 25);
        const yStep = Math.max(70, gap + 25);
        const cols = Math.ceil(650 / xStep) + 1;
        const rows = Math.ceil(850 / yStep) + 1;
        const tiles = [];

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const stagger = (r % 2 === 1) ? Math.round(xStep / 2) : 0;
                const left = (c * xStep) + stagger - 20;
                const top = (r * yStep) - 20;

                if (logoSrc) {
                    tiles.push(
                        <Image
                            key={`wm-logo-${r}-${c}`}
                            src={logoSrc}
                            style={{
                                position: 'absolute',
                                left,
                                top,
                                width: tileSize,
                                height: 'auto',
                                opacity,
                                objectFit: 'contain',
                                transform: rotation ? `rotate(${rotation}deg)` : undefined,
                            }}
                        />
                    );
                } else {
                    tiles.push(
                        <Text
                            key={`wm-txt-fallback-${r}-${c}`}
                            style={{
                                position: 'absolute',
                                left,
                                top,
                                fontSize: 12,
                                opacity,
                                color: textColor,
                                fontFamily,
                                transform: `rotate(${rotation || -25}deg)`,
                            }}
                        >
                            {textContent}
                        </Text>
                    );
                }
            }
        }

        return (
            <View style={styles.fullscreenFixed} fixed>
                {tiles}
            </View>
        );
    }

    // 4. TEXT TILING (Repeating diagonal staggered text)
    if (mode === 'TEXT_TILING') {
        const fontSize = Math.min(Math.max(Math.round(size * 0.08), 10), 20);
        const xStep = Math.max(80, gap + 35);
        const yStep = Math.max(65, gap + 15);
        const cols = Math.ceil(650 / xStep) + 1;
        const rows = Math.ceil(850 / yStep) + 1;
        const tiles = [];

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const stagger = (r % 2 === 1) ? Math.round(xStep / 2) : 0;
                const left = (c * xStep) + stagger - 30;
                const top = (r * yStep) - 10;

                tiles.push(
                    <Text
                        key={`wm-txt-${r}-${c}`}
                        style={{
                            position: 'absolute',
                            left,
                            top,
                            fontSize,
                            opacity,
                            color: textColor,
                            fontFamily,
                            transform: `rotate(${rotation || -25}deg)`,
                            letterSpacing: 1,
                        }}
                    >
                        {textContent}
                    </Text>
                );
            }
        }

        return (
            <View style={styles.fullscreenFixed} fixed>
                {tiles}
            </View>
        );
    }

    return null;
}

const styles = StyleSheet.create({
    fullscreenFixed: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
        overflow: 'hidden',
    },
    centerContainer: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    singleText: {
        letterSpacing: 3,
        textTransform: 'uppercase',
        textAlign: 'center',
    },
});
