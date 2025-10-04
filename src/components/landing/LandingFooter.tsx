export function LandingFooter() {
  return (
    <footer className="bg-gradient-to-b from-brand-50 to-linen-100 dark:from-brand-950 dark:to-brand-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Yieldly. Your personal investment tracker.
          </p>
          <p className="text-xs text-muted-foreground/70">
            Built for personal use • Guest accounts welcome to explore
          </p>
        </div>
      </div>
    </footer>
  )
}

