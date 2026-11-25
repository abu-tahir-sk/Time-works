"use client"

import React, { useState } from "react"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare, ShieldCheck, Clock } from "lucide-react"
import { toast } from "sonner"

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields.")
      return
    }

    setLoading(true)
    // Simulate enterprise inquiry dispatch
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
      toast.success("Inquiry sent successfully! Our finance support team will respond within 2 hours.")
    }, 800)
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f8] dark:bg-[#111318] text-foreground font-sans">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        <section className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-4 mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#c82020]/10 text-[#c82020] border border-[#c82020]/20">
            <MessageSquare className="h-3.5 w-3.5" />
            <span>24/7 Enterprise Assistance</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Contact Times Works Support & Sales.
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            Have questions about billing, enterprise SLA, custom integrations, or account governance? We are here to help.
          </p>
        </section>

        <section className="max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Contact Details Column */}
          <div className="space-y-4">
            <Card className="border border-border/80 bg-card shadow-2xs">
              <CardContent className="p-6 space-y-6">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-[#c82020]/10 text-[#c82020] shrink-0">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground">Email Support</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">billing@timesworks.com</p>
                    <p className="text-[11px] text-muted-foreground/80">legal@timesworks.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-[#c82020]/10 text-[#c82020] shrink-0">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground">Phone Hotline</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">+1 (800) 555-0199</p>
                    <p className="text-[11px] text-muted-foreground/80">Mon-Fri 8:00 AM - 6:00 PM EST</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-[#c82020]/10 text-[#c82020] shrink-0">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground">Headquarters</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">Times Works Tower, Suite 400</p>
                    <p className="text-[11px] text-muted-foreground/80">Redmond, WA 98052, USA</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-border/60 flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-4 w-4 text-[#c82020]" />
                  <span>Average response time: &lt; 2 hours</span>
                </div>
              </CardContent>
            </Card>

            <div className="p-5 rounded-xl border bg-muted/20 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#c82020]">
                <ShieldCheck className="h-4 w-4" />
                <span>Enterprise SLA Guarantee</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                All Professional and Enterprise accounts include direct Slack/Teams bridge support and 99.99% cloud document generation uptime.
              </p>
            </div>
          </div>

          {/* Contact Form Column */}
          <div className="lg:col-span-2">
            <Card className="border border-border/80 bg-card shadow-2xs">
              <CardHeader className="p-6 pb-4">
                <CardTitle className="text-lg font-bold text-foreground">Send us a Message</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Fill in your details and an enterprise specialist will follow up promptly.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6 pt-2">
                {submitted ? (
                  <div className="p-8 text-center space-y-4 bg-muted/10 rounded-lg border border-dashed">
                    <div className="h-12 w-12 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-foreground">Thank you for reaching out!</h3>
                      <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                        Your message has been assigned Ticket #TW-
                        {Math.floor(10000 + Math.random() * 90000)}. Our support desk is reviewing it now.
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSubmitted(false)
                        setFormData({ name: "", email: "", subject: "", message: "" })
                      }}
                      className="text-xs"
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold">Your Full Name *</Label>
                        <Input
                          placeholder="Alexandra Rivera"
                          className="h-9.5 text-xs"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold">Business Email *</Label>
                        <Input
                          type="email"
                          placeholder="billing@company.com"
                          className="h-9.5 text-xs"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Subject / Area of Interest</Label>
                      <Input
                        placeholder="e.g. Enterprise Plan inquiry, API integration, or Billing question"
                        className="h-9.5 text-xs"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Message / Details *</Label>
                      <Textarea
                        placeholder="Describe your inquiry, volume requirements, or technical question..."
                        className="min-h-[120px] text-xs resize-y"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto h-9.5 px-6 bg-[#c82020] hover:bg-[#a81a1a] text-white text-xs font-bold rounded-md shadow-xs transition-colors"
                    >
                      <Send className="h-3.5 w-3.5 mr-2" />
                      {loading ? "Sending Message..." : "Submit Inquiry"}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
