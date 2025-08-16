import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookOpen, Star, Search, SlidersHorizontal } from "lucide-react";
import { Link } from "react-router";

// Mock book data
const mockBooks = [
  {
    id: 1,
    title: "The Seven Husbands of Evelyn Hugo",
    author: "Taylor Jenkins Reid",
    genre: "Fiction",
    rating: 4.8,
    year: 2017,
    pages: 400,
    description:
      "A reclusive Hollywood icon finally tells her story to a young journalist.",
  },
  {
    id: 2,
    title: "Atomic Habits",
    author: "James Clear",
    genre: "Self-Help",
    rating: 4.7,
    year: 2018,
    pages: 320,
    description:
      "An easy and proven way to build good habits and break bad ones.",
  },
  {
    id: 3,
    title: "The Silent Patient",
    author: "Alex Michaelides",
    genre: "Thriller",
    rating: 4.6,
    year: 2019,
    pages: 336,
    description:
      "A woman's act of violence against her husband and her refusal to speak.",
  },
  {
    id: 4,
    title: "Educated",
    author: "Tara Westover",
    genre: "Memoir",
    rating: 4.9,
    year: 2018,
    pages: 334,
    description:
      "A memoir about a young girl who, kept out of school, leaves her survivalist family.",
  },
  {
    id: 5,
    title: "Where the Crawdads Sing",
    author: "Delia Owens",
    genre: "Fiction",
    rating: 4.5,
    year: 2018,
    pages: 384,
    description:
      "A mystery about a young woman who raised herself in the marshes of North Carolina.",
  },
  {
    id: 6,
    title: "Becoming",
    author: "Michelle Obama",
    genre: "Memoir",
    rating: 4.8,
    year: 2018,
    pages: 448,
    description:
      "The memoir of former United States First Lady Michelle Obama.",
  },
  {
    id: 7,
    title: "The Midnight Library",
    author: "Matt Haig",
    genre: "Fiction",
    rating: 4.4,
    year: 2020,
    pages: 288,
    description:
      "Between life and death there is a library, and within that library, the shelves go on forever.",
  },
  {
    id: 8,
    title: "Sapiens",
    author: "Yuval Noah Harari",
    genre: "Non-Fiction",
    rating: 4.6,
    year: 2014,
    pages: 464,
    description:
      "A brief history of humankind from the Stone Age to the present.",
  },
];

const genres = [
  "All Genres",
  "Fiction",
  "Non-Fiction",
  "Thriller",
  "Self-Help",
  "Memoir",
  "Romance",
  "Fantasy",
  "Mystery",
];
const ratings = ["All Ratings", "4.5+", "4.0+", "3.5+", "3.0+"];
const years = [
  "All Years",
  "2020-2024",
  "2015-2019",
  "2010-2014",
  "Before 2010",
];

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All Genres");
  const [selectedRating, setSelectedRating] = useState("All Ratings");
  const [selectedYear, setSelectedYear] = useState("All Years");
  const [showFilters, setShowFilters] = useState(false);

  // Filter books based on search criteria
  const filteredBooks = mockBooks.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre =
      selectedGenre === "All Genres" || book.genre === selectedGenre;
    const matchesRating =
      selectedRating === "All Ratings" ||
      book.rating >= Number.parseFloat(selectedRating.replace("+", ""));

    let matchesYear = true;
    if (selectedYear !== "All Years") {
      if (selectedYear === "2020-2024") matchesYear = book.year >= 2020;
      else if (selectedYear === "2015-2019")
        matchesYear = book.year >= 2015 && book.year <= 2019;
      else if (selectedYear === "2010-2014")
        matchesYear = book.year >= 2010 && book.year <= 2014;
      else if (selectedYear === "Before 2010") matchesYear = book.year < 2010;
    }

    return matchesSearch && matchesGenre && matchesRating && matchesYear;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <span className="text-2xl font-serif font-bold text-foreground">
              Bookrec
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-foreground hover:text-primary transition-colors"
            >
              Home
            </Link>
            <Link href="/search" className="text-primary font-medium">
              Search
            </Link>
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

      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-4">
            Discover Books
          </h1>
          <p className="text-lg text-muted-foreground">
            Search through thousands of books and find your next great read
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search by title, author, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>
            <p className="text-sm text-muted-foreground">
              {filteredBooks.length} books found
            </p>
          </div>

          {/* Filters */}
          {showFilters && (
            <Card className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Genre
                  </label>
                  <Select
                    value={selectedGenre}
                    onValueChange={setSelectedGenre}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {genres.map((genre) => (
                        <SelectItem key={genre} value={genre}>
                          {genre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Rating
                  </label>
                  <Select
                    value={selectedRating}
                    onValueChange={setSelectedRating}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ratings.map((rating) => (
                        <SelectItem key={rating} value={rating}>
                          {rating}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Publication Year
                  </label>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <Card
              key={book.id}
              className="group hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <CardContent className="p-6">
                <div className="aspect-[3/4] bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg mb-4 flex items-center justify-center">
                  <BookOpen className="h-12 w-12 text-primary/60" />
                </div>
                <h3 className="font-serif font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {book.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-2">
                  by {book.author}
                </p>
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                  {book.description}
                </p>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="text-xs">
                    {book.genre}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-accent text-accent" />
                    <span className="text-sm font-medium">{book.rating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{book.year}</span>
                  <span>{book.pages} pages</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredBooks.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-serif font-semibold text-foreground mb-2">
              No books found
            </h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or browse our featured
              recommendations
            </p>
            <Link href="/">
              <Button variant="outline">Browse Featured Books</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
