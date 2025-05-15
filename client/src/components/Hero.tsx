import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="py-8 sm:py-12">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
          Learn <span className="text-primary">Cybersecurity</span> Through Interactive Visualizations
        </h1>
        <p className="text-base sm:text-lg max-w-2xl mb-6 sm:mb-8 text-gray-400 px-2 sm:px-0">
          Explore network concepts, operating system fundamentals, and OWASP Top 10 vulnerabilities with hands-on interactive visualizations.
        </p>
      </div>
    </section>
  );
}
