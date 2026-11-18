import React from 'react';
import { View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import { DesignSettings } from '@/lib/design-system/schema';
import { getFontFamilyBold } from './font-utils';

interface WatermarkLayerProps {
    ds: DesignSettings;
    companyLogo?: string;
    companyName?: string;
}

/**
 * Single, centered photo (logo) watermark — like the original design.
 *
 * The "Watermark Theme Options" picker was removed on purpose, so this layer
 * does not read watermark modes (tiling, text, corner, band, frame, etc.).
 * It always renders one large, subtle logo watermark. It can only be turned
 * off by explicitly saving `designSettings.watermark.enabled = false`.
 */
export function WatermarkLayer({ ds, companyLogo, companyName }: WatermarkLayerProps) {
    const wm: any = ds.watermark || {};

    if (wm.enabled === false) {
        return null;
    }

    const opacity = typeof wm.opacity === 'number' ? wm.opacity : (wm.logo?.opacity ?? 0.05);
    const size = typeof wm.size === 'number' ? wm.size : (wm.logo?.size ?? 220);

    // Uploaded watermark logo (if one was saved earlier) wins, otherwise the company photo logo.
    const logoSrc = wm.logo?.url || companyLogo || '';
    const textContent = companyName || 'DocuFlow';
    const textColor = wm.text?.color || '#0f172a';
    const fontFamily = getFontFamilyBold(wm.text?.fontFamily || ds.typography?.fontFamily);

    if (!logoSrc) {
        // No logo photo available — fall back to a single centered text watermark.
        return (
            <View style={styles.fullscreenFixed} fixed>
                <View style={styles.centerContainer}>
                    <Text
                        style={[
                            styles.singleText,
                            {
                                fontSize: Math.min(Math.max(Math.round(size * 0.28), 32), 72),
                                opacity,
                                color: textColor,
                                fontFamily,
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
                        width: Math.min(Math.max(size, 80), 320),
                        height: 'auto',
                        maxHeight: 280,
                        opacity,
                        objectFit: 'contain',
                    }}
                />
            </View>
        </View>
    );
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
        transform: 'rotate(-35deg)',
        letterSpacing: 3,
        textTransform: 'uppercase',
        textAlign: 'center',
    },
});
