export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col items-center justify-center text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          EcomBD <span className="text-primary">Footwear</span>
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          Premium shoes and footwear collection designed for comfort, style, and performance.
        </p>
      </div>
    </div>
  );
}

