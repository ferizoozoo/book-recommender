import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Star,
  Users,
  Sparkles,
  ArrowRight,
  Quote,
  Link,
} from "lucide-react";
import { useNavigate } from "react-router";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <span className="text-2xl font-serif font-bold text-foreground">
              Bookrec
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a
              href="#discover"
              className="text-foreground hover:text-primary transition-colors"
            >
              Discover
            </a>
            <a
              href="#genres"
              className="text-foreground hover:text-primary transition-colors"
            >
              Genres
            </a>
            <a
              href="#about"
              className="text-foreground hover:text-primary transition-colors"
            >
              About
            </a>
            <Button variant="outline" size="sm">
              Sign In
            </Button>
            <Button size="sm">Sign Up</Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="flex justify-center mb-6">
            <Badge
              variant="secondary"
              className="px-4 py-2 text-sm font-medium"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              AI-Powered Recommendations
            </Badge>
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-black text-foreground mb-6 leading-tight">
            Find Your Next
            <span className="text-primary block">Favorite Read</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto font-sans">
            Discover personalized book recommendations tailored to your unique
            taste. Join thousands of readers finding their perfect next book.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => {
                navigate("/library/search");
              }}
              size="lg"
              className="text-lg px-8 py-6"
            >
              Find Your Next Read
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-6 bg-transparent"
            >
              Browse Popular Books
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Books */}
      <section id="discover" className="py-16 px-4 bg-secondary/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              Trending Recommendations
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See what books our community is loving right now
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "The Seven Husbands of Evelyn Hugo",
                author: "Taylor Jenkins Reid",
                genre: "Fiction",
                rating: 4.8,
              },
              {
                title: "Atomic Habits",
                author: "James Clear",
                genre: "Self-Help",
                rating: 4.7,
              },
              {
                title: "The Silent Patient",
                author: "Alex Michaelides",
                genre: "Thriller",
                rating: 4.6,
              },
              {
                title: "Educated",
                author: "Tara Westover",
                genre: "Memoir",
                rating: 4.9,
              },
            ].map((book, index) => (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <CardContent className="p-6">
                  <div className="aspect-[3/4] bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg mb-4 flex items-center justify-center">
                    <BookOpen className="h-12 w-12 text-primary/60" />
                  </div>
                  <h3 className="font-serif font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {book.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-2">
                    by {book.author}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {book.genre}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-accent text-accent" />
                      <span className="text-sm font-medium">{book.rating}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              Why Choose Bookrec?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our intelligent recommendation system learns your preferences to
              suggest books you'll love
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Sparkles className="h-8 w-8 text-primary" />,
                title: "AI-Powered Matching",
                description:
                  "Our advanced algorithm analyzes your reading history and preferences to find perfect matches.",
              },
              {
                icon: <Users className="h-8 w-8 text-primary" />,
                title: "Community Insights",
                description:
                  "Discover what readers with similar tastes are loving and get recommendations from real people.",
              },
              {
                icon: <BookOpen className="h-8 w-8 text-primary" />,
                title: "Diverse Library",
                description:
                  "Explore millions of books across every genre, from bestsellers to hidden gems waiting to be discovered.",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="text-center p-8 hover:shadow-md transition-shadow"
              >
                <CardContent className="p-0">
                  <div className="mb-4 flex justify-center">{feature.icon}</div>
                  <h3 className="text-xl font-serif font-semibold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-secondary/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              What Readers Say
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "Bookrec introduced me to authors I never would have discovered on my own. Every recommendation has been spot-on!",
                author: "Sarah M.",
                books: "127 books read",
              },
              {
                quote:
                  "I was stuck in a reading rut until I found Bookrec. Now I'm excited about every book on my to-read list.",
                author: "Michael R.",
                books: "89 books read",
              },
              {
                quote:
                  "The personalized recommendations are incredible. It's like having a librarian who knows exactly what I love.",
                author: "Emma L.",
                books: "203 books read",
              },
            ].map((testimonial, index) => (
              <Card key={index} className="p-6">
                <CardContent className="p-0">
                  <Quote className="h-8 w-8 text-accent mb-4" />
                  <p className="text-foreground mb-4 italic">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-foreground">
                        {testimonial.author}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.books}
                      </p>
                    </div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-accent text-accent"
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
            Ready to Discover Your Next Great Read?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join over 50,000 readers who've found their perfect books with
            Bookrec
          </p>
          <Button size="lg" className="text-lg px-12 py-6">
            Get Started Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            No credit card required • Free forever plan available
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 bg-secondary/20">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-6 w-6 text-primary" />
                <span className="text-xl font-serif font-bold text-foreground">
                  Bookrec
                </span>
              </div>
              <p className="text-muted-foreground text-sm">
                Helping readers discover their next favorite book through
                intelligent recommendations.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    How it Works
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Bookrec. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
