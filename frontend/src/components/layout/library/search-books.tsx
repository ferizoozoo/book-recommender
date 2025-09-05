import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { BookOpen, Star, Search } from "lucide-react";
import { Link } from "react-router-dom";
import config from "../../../../config";
import Header from "@/components/blocks/header";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBooks, setFilteredBooks] = useState<any[]>([]);

  const handleSearch = async () => {
    // Call the search function with the current filters
    const filters = {
      title: searchQuery,
      author: searchQuery,
      year: searchQuery,
    };
    const res = await fetch(`${config.apiUrl}/library/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(filters),
    });

    const data = await res.json();
    const books = data.books;
    setFilteredBooks(books);
  };

  useEffect(() => {
    if (searchQuery.length <= 3) setFilteredBooks([]);
    handleSearch();
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

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
              placeholder="Search by title, author, year or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks && filteredBooks.length > 0 ? (
            filteredBooks?.map((book) => (
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
                    by {book.author.firstname} {book.author.lastname}
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
            ))
          ) : (
            <div>No books found</div>
          )}
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
