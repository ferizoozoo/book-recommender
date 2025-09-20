import { AppSidebar } from "@/components/blocks/app-sidebar";
import { SiteHeader } from "@/components/blocks/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useEffect, useState } from "react";
import { useFetchWithAuth } from "@/hooks/use-fetch-with-auth";
import config from "../../../../config";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/auth-context";

// Import dashboard forms and tables
import { BookForm } from "@/components/forms/dashboard/bookForm";
import { AuthorForm } from "@/components/forms/dashboard/authorForm";
import { PublisherForm } from "@/components/forms/dashboard/publisherForm";
import { BooksTable } from "@/components/forms/dashboard/bookTable";
import { AuthorsTable } from "@/components/forms/dashboard/authorTable";
import { PublishersTable } from "@/components/forms/dashboard/publisherTable";
import { DialogTrigger } from "@radix-ui/react-dialog";

export default function Dashboard() {
  const fetchWithAuth = useFetchWithAuth();
  const { accessToken } = useAuthContext();
  const navigate = useNavigate();

  // State for each entity type
  const [books, setBooks] = useState<any[]>([]);
  const [authors, setAuthors] = useState<any[]>([]);
  const [publishers, setPublishers] = useState<any[]>([]);

  // Form visibility states
  const [showBookForm, setShowBookForm] = useState(false);
  const [showAuthorForm, setShowAuthorForm] = useState(false);
  const [showPublisherForm, setShowPublisherForm] = useState(false);

  useEffect(() => {
    if (!accessToken) navigate("/login");

    async function fetchData() {
      try {
        // Fetch books
        const booksRes = await fetchWithAuth(`${config.apiUrl}/library/books`);
        if (booksRes.ok) {
          const data = await booksRes.json();
          const booksData = data.books;
          debugger;
          // Initialize as empty array if undefined/null
          setBooks(booksData || []);
        } else {
          // Initialize as empty array on error
          setBooks([]);
          console.error("Failed to fetch books:", await booksRes.text());
        }

        // Fetch authors
        // const authorsRes = await fetchWithAuth(
        //   `${config.apiUrl}/library/authors`
        // );
        // if (authorsRes.ok) {
        //   const authorsData = await authorsRes.json();
        //   setAuthors(authorsData);
        // }

        // // Fetch publishers
        // const publishersRes = await fetchWithAuth(
        //   `${config.apiUrl}/library/publishers`
        // );
        // if (publishersRes.ok) {
        //   const publishersData = await publishersRes.json();
        //   setPublishers(publishersData);
        // }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    }

    fetchData();
  }, [accessToken]);

  // Form submission handlers
  const handleBookSubmit = async (bookData: any) => {
    try {
      const res = await fetchWithAuth(`${config.apiUrl}/library/books`, {
        method: "POST",
        body: JSON.stringify(bookData),
      });
      if (res.ok) {
        const newBook = await res.json();
        setBooks([...books, newBook]);
      }
    } catch (error) {
      console.error("Failed to add book:", error);
    }
  };

  const handleAuthorSubmit = async (authorData: any) => {
    try {
      const res = await fetchWithAuth(`${config.apiUrl}/library/authors`, {
        method: "POST",
        body: JSON.stringify(authorData),
      });
      if (res.ok) {
        const newAuthor = await res.json();
        setAuthors([...authors, newAuthor]);
      }
    } catch (error) {
      console.error("Failed to add author:", error);
    }
  };

  const handlePublisherSubmit = async (publisherData: any) => {
    try {
      const res = await fetchWithAuth(`${config.apiUrl}/library/publishers`, {
        method: "POST",
        body: JSON.stringify(publisherData),
      });
      if (res.ok) {
        const newPublisher = await res.json();
        setPublishers([...publishers, newPublisher]);
      }
    } catch (error) {
      console.error("Failed to add publisher:", error);
    }
  };

  // Edit handlers
  const handleBookEdit = (book: any) => {
    try {
      const id = book.id;
      fetchWithAuth(`${config.apiUrl}/library/books/${id}`, {
        method: "PUT",
        body: JSON.stringify(book),
      }).then(async (res) => {
        if (res.ok) {
          const updatedBook = await res.json();
          setBooks(books.map((b) => (b.id === id ? updatedBook : b)));
        }
      });
    } catch (error) {
      console.error("Failed to update book:", error);
    }
  };

  const handleAuthorEdit = (author: any) => {
    try {
      const id = author.id;
      fetchWithAuth(`${config.apiUrl}/library/authors/${id}`, {
        method: "PUT",
        body: JSON.stringify(author),
      }).then(async (res) => {
        if (res.ok) {
          const updatedAuthor = await res.json();
          setAuthors(authors.map((a) => (a.id === id ? updatedAuthor : a)));
        }
      });
    } catch (error) {
      console.error("Failed to update author:", error);
    }
  };

  const handlePublisherEdit = (publisher: any) => {
    try {
      const id = publisher.id;
      fetchWithAuth(`${config.apiUrl}/library/publishers/${id}`, {
        method: "PUT",
        body: JSON.stringify(publisher),
      }).then(async (res) => {
        if (res.ok) {
          const updatedPublisher = await res.json();
          setPublishers(
            publishers.map((p) => (p.id === id ? updatedPublisher : p))
          );
        }
      });
    } catch (error) {
      console.error("Failed to update publisher:", error);
    }
  };

  // Delete handlers
  const handleBookDelete = (id: string) => {
    try {
      fetchWithAuth(`${config.apiUrl}/library/books/${id}`, {
        method: "DELETE",
      }).then((res) => {
        if (res.ok) {
          setBooks(books.filter((book) => book.id !== id));
        }
      });
    } catch (error) {
      console.error("Failed to delete book:", error);
    }
  };

  const handleAuthorDelete = (id: string) => {
    try {
      fetchWithAuth(`${config.apiUrl}/library/authors/${id}`, {
        method: "DELETE",
      }).then((res) => {
        if (res.ok) {
          setAuthors(authors.filter((author) => author.id !== id));
        }
      });
    } catch (error) {
      console.error("Failed to delete author:", error);
    }
  };

  const handlePublisherDelete = (id: string) => {
    try {
      fetchWithAuth(`${config.apiUrl}/library/publishers/${id}`, {
        method: "DELETE",
      }).then((res) => {
        if (res.ok) {
          setPublishers(publishers.filter((publisher) => publisher.id !== id));
        }
      });
    } catch (error) {
      console.error("Failed to delete publisher:", error);
    }
  };

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <div className="flex flex-1 flex-col px-4">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <Tabs defaultValue="books" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="books">Books</TabsTrigger>
                <TabsTrigger value="authors">Authors</TabsTrigger>
                <TabsTrigger value="publishers">Publishers</TabsTrigger>
              </TabsList>

              <TabsContent value="books" className="mt-6">
                <div className="gap-6">
                  <div className="lg:col-span-3">
                    <div className="p-6">
                      <h3 className="text-lg font-medium mb-4">Books List</h3>
                      <BooksTable
                        books={books}
                        onEdit={handleBookEdit}
                        onDelete={handleBookDelete}
                        onAdd={handleBookSubmit}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="authors" className="mt-6">
                <div className="gap-6">
                  <div className="">
                    <div className="p-6">
                      <h3 className="text-lg font-medium mb-4">Authors List</h3>
                      <AuthorsTable
                        authors={authors}
                        onEdit={handleAuthorEdit}
                        onDelete={handleAuthorDelete}
                        onAdd={handleAuthorSubmit}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="publishers" className="mt-6">
                <div className="gap-6">
                  <div className="">
                    <div className="p-6">
                      <h3 className="text-lg font-medium mb-4">
                        Publishers List
                      </h3>
                      <PublishersTable
                        publishers={publishers}
                        onEdit={handlePublisherEdit}
                        onDelete={handlePublisherDelete}
                        onAdd={handlePublisherSubmit}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
