import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { BookOpen, Star, Search, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import config from "../../../../config";
import Header from "@/components/blocks/header";
import { useFetchWithAuth } from "@/hooks/use-fetch-with-auth";
import { useAuthContext } from "@/contexts/auth-context";

export default function SearchPage() {
  const fetchWithAuth = useFetchWithAuth();
  const { accessToken } = useAuthContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBooks, setFilteredBooks] = useState<any[]>([]);
  const [likedBooks, setLikedBooks] = useState<Set<number>>(new Set());
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [selectedBookForRating, setSelectedBookForRating] = useState<
    any | null
  >(null);
  const [userRating, setUserRating] = useState<number>(0);
  const [userRatings, setUserRatings] = useState<Map<number, number>>(
    new Map()
  );
  const [userReviews, setUserReviews] = useState<Map<number, any>>(new Map());
  const [reviewText, setReviewText] = useState<string>("");

  const handleSearch = async () => {
    const filters = {
      title: searchQuery,
      author: searchQuery,
      year: searchQuery,
    };
    const res = await fetchWithAuth(`${config.apiUrl}/library/search`, {
      method: "POST",
      body: JSON.stringify(filters),
    });

    const data = await res.json();
    const books = data.books;
    setFilteredBooks(books);

    // Fetch user's reviews for each book
    if (accessToken) {
      for (const book of books) {
        try {
          const reviewRes = await fetchWithAuth(
            `${config.apiUrl}/library/user-review/${book.id}`,
            {
              method: "GET",
            }
          );
          if (reviewRes.ok) {
            const reviewData = await reviewRes.json();
            console.log(`Review data for book ${book.id}:`, reviewData);
            if (reviewData.review) {
              console.log(
                `Setting review for book ${book.id}:`,
                reviewData.review
              );
              setUserReviews((prev) =>
                new Map(prev).set(book.id, reviewData.review)
              );
              setUserRatings((prev) =>
                new Map(prev).set(book.id, reviewData.review.rating)
              );
            }
          }
        } catch (error) {
          console.error(`Error fetching review for book ${book.id}:`, error);
        }
      }
    }
  };

  const handleLike = async ({ id }: { id: number }) => {
    // Placeholder for like functionality
    setLikedBooks((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
    await fetchWithAuth(`${config.apiUrl}/library/like`, {
      method: "POST",
      body: JSON.stringify({ bookId: id }),
    });
  };

  const handleRatingClick = (book: any) => {
    setSelectedBookForRating(book);
    setUserRating(0);
    setReviewText("");
    setRatingModalOpen(true);
  };

  const handleSubmitRating = async () => {
    if (selectedBookForRating && userRating > 0) {
      try {
        // Decode JWT to get userId
        const res = await fetchWithAuth(
          `${config.apiUrl}/library/reviews/${selectedBookForRating.id}`,
          {
            method: "POST",
            body: JSON.stringify({
              rating: userRating,
              review: reviewText,
            }),
          }
        );

        if (res.ok) {
          // Update the book's rating in the UI
          setFilteredBooks(
            filteredBooks.map((book) =>
              book.id === selectedBookForRating.id
                ? { ...book, rating: userRating }
                : book
            )
          );
          // Store user's rating
          setUserRatings(
            new Map(userRatings).set(selectedBookForRating.id, userRating)
          );
          // Store user's review
          setUserReviews(
            new Map(userReviews).set(selectedBookForRating.id, {
              rating: userRating,
              review: reviewText,
            })
          );
          setRatingModalOpen(false);
          setSelectedBookForRating(null);
          setUserRating(0);
          setReviewText("");
        }
      } catch (error) {
        console.error("Error submitting rating:", error);
      }
    }
  };

  useEffect(() => {
    if (searchQuery.length <= 3) setFilteredBooks([]);
    else handleSearch();
  }, [searchQuery]);

  // Fetch user's liked books on component mount
  useEffect(() => {
    const fetchLikedBooks = async () => {
      if (accessToken) {
        try {
          // TODO: that takes all the liked books IDs and can become slow with many books (needs to be optimized)
          const likedRes = await fetchWithAuth(
            `${config.apiUrl}/library/user/liked-books`,
            {
              method: "GET",
            }
          );
          if (likedRes.ok) {
            const likedData = await likedRes.json();
            setLikedBooks(new Set(likedData.likedBookIds));
          }
        } catch (error) {
          console.error("Error fetching liked books:", error);
        }
      }
    };

    fetchLikedBooks();
  }, [accessToken, fetchWithAuth]);

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
                className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-0 bg-card/50 backdrop-blur"
              >
                <CardContent className="p-5">
                  <div className="aspect-[3/4] bg-gradient-to-br from-primary/30 via-accent/20 to-primary/10 rounded-lg mb-4 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                    <BookOpen className="h-14 w-14 text-primary/70" />
                  </div>
                  <h3 className="font-serif font-bold text-base text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-2">
                    {book.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-3 font-medium">
                    by {book.author.firstname} {book.author.lastname}
                  </p>
                  <div className="space-y-3">
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {book.description}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary" className="text-xs px-2 py-1">
                        {book.genre}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-xs px-2 py-1 bg-background/50"
                      >
                        {book.year}
                      </Badge>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {userReviews.has(book.id) && (
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={16}
                              className={`${
                                star <= (userRatings.get(book.id) || 0)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                      )}
                      <Heart
                        onClick={() => handleLike({ id: book.id })}
                        className={`h-5 w-5 cursor-pointer transition-all ${
                          likedBooks.has(book.id)
                            ? "fill-red-500 text-red-500"
                            : "text-muted-foreground hover:text-red-500"
                        }`}
                      />
                    </div>
                    <Button
                      variant={userReviews.has(book.id) ? "outline" : "default"}
                      size="sm"
                      onClick={() => handleRatingClick(book)}
                      disabled={userReviews.has(book.id)}
                      className="text-xs cursor-pointer font-semibold px-3 py-2 bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      {userReviews.has(book.id) ? "✓ Rated" : "Rate"}
                    </Button>
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
            <Link to="/">
              <Button variant="outline">Browse Featured Books</Button>
            </Link>
          </div>
        )}
      </div>

      {/* Rating Modal */}
      <Dialog open={ratingModalOpen} onOpenChange={setRatingModalOpen}>
        <DialogContent
          className="sm:max-w-[425px] bg-gray-100 border border-gray-300 shadow-2xl"
          style={{ backdropFilter: "blur(4px)" }}
        >
          <DialogHeader>
            <DialogTitle>Rate "{selectedBookForRating?.title}"</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Rate this book</p>
              <div className="flex gap-3 justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setUserRating(star)}
                    className="transition-transform hover:scale-125 cursor-pointer"
                  >
                    <Star
                      size={32}
                      className={`${
                        star <= userRating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2 gap-4">
              <label className="text-sm font-medium text-foreground">
                Your Review (optional)
              </label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your thoughts about this book..."
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              className="cursor-pointer"
              variant="outline"
              onClick={() => setRatingModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="cursor-pointer"
              onClick={handleSubmitRating}
              disabled={userRating === 0}
            >
              Submit Rating
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
