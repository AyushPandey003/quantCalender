"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-br from-primary/5 via-blue-500/5 to-green-500/5">
      <div className="container mx-auto px-6">
        <Card className="max-w-4xl mx-auto border-0 bg-gradient-to-br from-background/80 to-muted/50 backdrop-blur-sm">
          <CardContent className="p-12 text-center space-y-8">
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="p-4 bg-primary/10 rounded-full">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                Ready to explore{" "}
                <span className="bg-gradient-to-r from-primary via-blue-500 to-green-500 bg-clip-text text-transparent">
                  market patterns?
                </span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Start analyzing cryptocurrency markets with our powerful calendar analytics platform. Get real-time
                insights and discover seasonal trading opportunities.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="px-8 py-6 text-lg">
                <Link href="/dashboard">
                  Start Free Analysis
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="px-8 py-6 text-lg bg-transparent">
                <Link href="/settings">View Settings</Link>
              </Button>
            </div>

            <div className="text-sm text-muted-foreground">
              No credit card required • Free tier available • Enterprise plans starting at $99/month
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
