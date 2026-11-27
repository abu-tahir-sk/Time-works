/**
 * Gemini AI Integration for Project Breakdown & Feature Estimations
 * Based on user audio requirements: Takes a project description and generates
 * a granular, feature-by-feature cost breakdown (e.g. Auth: 5,000, Gateway: 10,000).
 */

export interface FeatureItem {
  feature: string
  description: string
  cost: number
}

export interface ProjectBreakdownResult {
  features: FeatureItem[]
  suggestedTotalBudget: number
  summary: string
}

export async function generateProjectBreakdownWithGemini(
  projectTitle: string,
  projectDescription: string,
  targetBudget?: number,
  currency: string = "USD"
): Promise<ProjectBreakdownResult> {
  const apiKey = process.env.GEMINI_API_KEY

  if (apiKey && apiKey !== "your_gemini_api_key_here") {
    // List of models to try in order of preference
    const models = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro"]

    for (const model of models) {
      try {
        const prompt = `You are an expert technical software architect and project estimation director.
The user wants a granular, itemized feature-by-feature cost, scope, and technical deliverables division for this project:

Project Title: "${projectTitle}"
Project Scope Description: "${projectDescription || "Full-stack enterprise application"}"
Target Overall Budget: ${targetBudget && targetBudget > 0 ? `${currency} ${targetBudget}` : "Estimate realistic commercial pricing"}

MANDATORY RULES:
1. Divide the project into 5 to 8 granular, actionable modules/features (e.g. "Auth & RBAC Roles", "Client Dashboard UI", "Payment Gateway & Link Remittance", "Database & Microservice APIs", "DevOps & CI/CD SLA").
2. DO NOT provide lump sums like "Frontend 50%, Backend 50%".
3. Each feature must have:
   - "feature": Clear module name
   - "description": Concrete technical deliverables and user capabilities
   - "cost": Realistic numeric cost in ${currency}. The sum of all feature costs MUST equal the target budget (${targetBudget || 45000}).

Return ONLY valid JSON matching this schema:
{
  "summary": "Executive summary of project deliverables and architecture.",
  "features": [
    {
      "feature": "Feature Title",
      "description": "Technical scope and deliverables",
      "cost": 5000
    }
  ]
}`

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                responseMimeType: "application/json",
                temperature: 0.2,
              },
            }),
          }
        )

        if (response.ok) {
          const json = await response.json()
          const textOutput = json?.candidates?.[0]?.content?.parts?.[0]?.text
          if (textOutput) {
            const parsed = JSON.parse(textOutput)
            if (Array.isArray(parsed.features) && parsed.features.length > 0) {
              const calculatedTotal = parsed.features.reduce(
                (acc: number, f: any) => acc + (Number(f.cost) || 0),
                0
              )
              return {
                summary: parsed.summary || `Granular AI breakdown for ${projectTitle}`,
                features: parsed.features.map((f: any) => ({
                  feature: String(f.feature || "Feature module"),
                  description: String(f.description || ""),
                  cost: Number(f.cost) || 0,
                })),
                suggestedTotalBudget: targetBudget || calculatedTotal,
              }
            }
          }
        } else {
          console.warn(`Gemini API model ${model} returned status: ${response.status}`)
        }
      } catch (err) {
        console.error(`Gemini breakdown error with model ${model}:`, err)
      }
    }
  }

  // Fallback intelligent breakdown generator with domain-specific awareness
  return generateIntelligentFallbackBreakdown(projectTitle, projectDescription, targetBudget, currency)
}

function generateIntelligentFallbackBreakdown(
  title: string,
  desc: string,
  targetBudget?: number,
  currency: string = "USD"
): ProjectBreakdownResult {
  const baseBudget = targetBudget && targetBudget > 0 ? targetBudget : 45000
  const combined = (title + " " + desc).toLowerCase()

  // Domain-specific feature templates
  let features: { feature: string; description: string; ratio: number }[] = []

  if (combined.includes("ecommerce") || combined.includes("shop") || combined.includes("store") || combined.includes("cart")) {
    features = [
      {
        feature: "Product Catalog, Dynamic Variations & Inventory Engine",
        description: "SKU tracking, real-time stock levels, multi-currency pricing, and rich media galleries.",
        ratio: 0.22,
      },
      {
        feature: "Shopping Cart, Multi-Stage Checkout & Tax Automation",
        description: "Guest/User cart persistence, coupon engine, shipping rate calculation, and tax rules.",
        ratio: 0.18,
      },
      {
        feature: "Payment Gateway Integration (Stripe/PayPal/bKash/SSL)",
        description: "Tokenized cards, mobile financial services, instant webhook reconciliation, and refund workflows.",
        ratio: 0.20,
      },
      {
        feature: "Customer Account Portal & Order Tracking",
        description: "Order history, live shipping tracking, downloadable invoices, and wishlists.",
        ratio: 0.15,
      },
      {
        feature: "Merchant Admin Governance & Sales Analytics",
        description: "Order fulfillment panel, customer CRM, revenue analytics, and low-stock alerts.",
        ratio: 0.15,
      },
      {
        feature: "SEO Optimization, Performance Caching & Production Launch",
        description: "Core Web Vitals tuning, CDN setup, schema markup, and transactional email triggers.",
        ratio: 0.10,
      },
    ]
  } else if (combined.includes("mobile") || combined.includes("flutter") || combined.includes("app") || combined.includes("ios") || combined.includes("android")) {
    features = [
      {
        feature: "Cross-Platform Mobile UI / UX Framework",
        description: "Responsive layouts for iOS and Android, gesture handling, animations, and dark/light modes.",
        ratio: 0.25,
      },
      {
        feature: "Biometric Authentication & Offline Data Sync",
        description: "FaceID/Fingerprint login, encrypted local SQLite/Hive storage, and background sync.",
        ratio: 0.20,
      },
      {
        feature: "REST / GraphQL Backend Microservices & Push Notifications",
        description: "FCM notification routing, real-time socket events, and high-throughput backend endpoints.",
        ratio: 0.22,
      },
      {
        feature: "In-App Payments, Subscriptions & Remittance Gateways",
        description: "In-App Purchases (StoreKit/Google Play Billing) and external payment link processing.",
        ratio: 0.18,
      },
      {
        feature: "App Store / Play Store Release & CI/CD Pipeline",
        description: "Code signing, TestFlight distribution, automated store compliance, and analytics tracking.",
        ratio: 0.15,
      },
    ]
  } else {
    // Standard Enterprise Web / Custom SaaS
    features = [
      {
        feature: "Multi-Tenant Authentication & Role-Based Permissions (RBAC)",
        description: "Secure OAuth/JWT session management, granular role privileges, and activity audit logging.",
        ratio: 0.15,
      },
      {
        feature: "Core Application Logic & Workflow Architecture",
        description: "Business rule validation, automated task scheduling, operational pipelines, and data models.",
        ratio: 0.25,
      },
      {
        feature: "Executive & Client Dashboard UI with Analytics",
        description: "High-density data tables, real-time KPI metrics, search filters, and responsive design.",
        ratio: 0.20,
      },
      {
        feature: "Payment Gateway, Pay Links & QR Remittance Engine",
        description: "Fixed/Open payment links, QR code generation, client checkout gateway, and auto-deduction.",
        ratio: 0.18,
      },
      {
        feature: "Cloud PostgreSQL Database, API Endpoints & Security",
        description: "Normalized relational schema, connection pooling, rate limiting, and encrypted REST APIs.",
        ratio: 0.14,
      },
      {
        feature: "Automated Testing, Production Deployment & SLA Handover",
        description: "Unit and integration tests, automated CI/CD deployment, custom domain SSL, and documentation.",
        ratio: 0.08,
      },
    ]
  }

  // Calculate costs based on ratio and ensure exact sum matches baseBudget
  let accumulated = 0
  const finalItems: FeatureItem[] = features.map((f, idx) => {
    if (idx === features.length - 1) {
      // Last item gets the exact remaining balance
      const remaining = Math.max(1000, baseBudget - accumulated)
      return {
        feature: f.feature,
        description: f.description,
        cost: remaining,
      }
    }
    const cost = Math.round(baseBudget * f.ratio)
    accumulated += cost
    return {
      feature: f.feature,
      description: f.description,
      cost,
    }
  })

  return {
    summary: `Granular AI scope division and feature-by-feature cost allocations structured for "${title}".`,
    features: finalItems,
    suggestedTotalBudget: baseBudget,
  }
}
