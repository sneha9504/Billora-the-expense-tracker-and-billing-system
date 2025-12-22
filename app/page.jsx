import Link from "next/link"
import { ArrowRight, BarChart3, Package, Receipt, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10">
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
              B
            </div>
            <span className="text-xl font-bold text-foreground">Billora</span>
          </div>

          <nav className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/auth/register">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            Track, Save, Grow
            <span className="block text-primary">Together</span>
          </h1>

          <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground">
            Complete business management system for retail shops. Manage your
            inventory, process billing, track expenses, and grow your business
            with powerful analytics.
          </p>

          <div className="mt-10 flex items-center justify-center gap-4">
            <Link href="/auth/register">
              <Button size="lg" className="gap-2">
                Start Free Trial
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        <div className="mx-auto mt-20 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            icon={<BarChart3 className="h-6 w-6" />}
            title="Analytics Dashboard"
            description="Real-time insights into your business performance"
          />
          <FeatureCard
            icon={<Package className="h-6 w-6" />}
            title="Inventory Management"
            description="Track stock levels and manage products efficiently"
          />
          <FeatureCard
            icon={<Receipt className="h-6 w-6" />}
            title="POS Billing"
            description="DMart-style billing system with thermal printing"
          />
          <FeatureCard
            icon={<Wallet className="h-6 w-6" />}
            title="Expense Tracking"
            description="Monitor expenses and calculate profit margins"
          />
        </div>
      </main>
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="mt-4 font-semibold text-card-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
