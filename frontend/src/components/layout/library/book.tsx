import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  type Book,
  type Author,
  type Publisher,
} from "@/components/types.d.ts";
import { useParams } from "react-router";
import config from "@/../config";
import { useEffect, useState } from "react";
import Header from "@/components/blocks/header";

interface BookWithDetails extends Book {
  author: Author;
  publisher: Publisher;
  publishedDate: Date;
  image: string | null;
  genre: string;
  year: number;
  pages: number;
  isbn: string;
}

interface BookDetailPageProps {
  bookId: string;
}

// TODO: Add loading and book should be an object with details, not a string
function BookRecommendationCard({ book }: { book: BookWithDetails }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
      <div className="aspect-[2/3] relative bg-muted">
        {book.image ? (
          <img
            src={book.image || "/placeholder.svg"}
            alt={book.title}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <span className="text-muted-foreground text-sm">No cover</span>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h4 className="font-semibold text-sm line-clamp-2 mb-1">
          {book.title}
        </h4>
        {/* <p className="text-xs text-muted-foreground">{book.author?.name!}</p> */}
      </CardContent>
    </Card>
  );
}

export function BookDetailPage() {
  const { id } = useParams<{ id: string }>();

  const [book, setBook] = useState<BookWithDetails | null>(null);
  const [recommendations, setRecommendations] = useState<BookWithDetails[]>([]);

  useEffect(() => {
    async function fetchBookAndRecommendations() {
      debugger;
      const bookRes = await fetch(`${config.apiUrl}/library/books/${id}`);
      const b = (await bookRes.json()) as unknown as BookWithDetails;
      // const title = book ? book.book.title : "Book Not Found";
      const title = "Harry Potter and the Half-Blood Prince (Harry Potter  #6)";
      const encodedTitle = encodeURIComponent(title);
      const url = `${config.recommendationUrl}/recommendations/${encodedTitle}`;
      const recommendationsRes = await fetch(url);
      const recomms = await recommendationsRes.json();
      setBook(b.book);
      setRecommendations(recomms.recommendations);
    }
    fetchBookAndRecommendations();
  }, [id]);

  if (!book) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Book not found</p>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <div className="mb-6">
        <Header />
      </div>
      {/* Book Details Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {/* Book Cover */}
        <div className="md:col-span-1">
          <div className="aspect-[2/3] relative rounded-lg overflow-hidden shadow-lg bg-muted">
            {book.image ? (
              <img
                src={book.image || "/placeholder.svg"}
                alt={book.title}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-muted-foreground">
                  No cover available
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Book Information */}
        <div className="md:col-span-2 flex flex-col gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
            <p className="text-xl text-muted-foreground">
              by {book.author?.name!}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{book.genre}</Badge>
            <Badge variant="outline">{book.year}</Badge>
            <Badge variant="outline">{book.pages} pages</Badge>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Publisher</span>
              <p className="font-medium">{book.publisher?.name!}</p>
            </div>
            <div>
              <span className="text-muted-foreground">ISBN</span>
              <p className="font-medium">{book.isbn}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Published</span>
              <p className="font-medium">
                {/* {book.publishedDate?.toLocaleDateString()!} */}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Author Email</span>
              <p className="font-medium">{book.author?.email!}</p>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground leading-relaxed">
              {book.description || "No description available."}
            </p>
          </div>

          {book.author?.bio && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">About the Author</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {book.author?.bio}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Recommendations Section */}
      {recommendations.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {recommendations.map((recBook, index) => (
              <BookRecommendationCard key={index} book={recBook} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
