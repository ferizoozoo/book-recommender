import { AppSidebar } from "@/components/blocks/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useCallback, useEffect, useState } from "react";
import { useFetchWithAuth } from "@/hooks/use-fetch-with-auth";
import config from "../../../../config";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/auth-context";

import { BooksTable } from "@/components/forms/dashboard/bookTable";
import { AuthorsTable } from "@/components/forms/dashboard/authorTable";
import { PublishersTable } from "@/components/forms/dashboard/publisherTable";
import { UserTable as UsersTable } from "@/components/forms/dashboard/userTable";
import { ProfileForm } from "@/components/forms/dashboard/profileForm";
import { useLocation } from "react-router-dom";

export default function Dashboard() {
  const location = useLocation();
  const fetchWithAuth = useFetchWithAuth();
  const { accessToken } = useAuthContext();
  const navigate = useNavigate();

  // State for each entity type
  const [books, setBooks] = useState<any[]>([]);
  const [authors, setAuthors] = useState<any[]>([]);
  const [publishers, setPublishers] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Stable, targeted fetchers to avoid re-creating on every render
  const fetchBooks = useCallback(
    async (signal?: AbortSignal) => {
      try {
        const booksRes = await fetchWithAuth(`${config.apiUrl}/library/books`, {
          signal,
        });
        if (booksRes.ok) {
          const data = await booksRes.json();
          setBooks(data.books || []);
        } else {
          setBooks([]);
          console.error("Failed to fetch books:", await booksRes.text());
        }
      } catch (error) {
        if ((error as any).name !== "AbortError") {
          console.error("Failed to fetch books:", error);
        }
      }
    },
    [fetchWithAuth]
  );

  const fetchAuthors = useCallback(
    async (signal?: AbortSignal) => {
      try {
        const res = await fetchWithAuth(`${config.apiUrl}/library/authors`, {
          signal,
        });
        if (res.ok) {
          const data = await res.json();
          setAuthors(data.authors || []);
        }
      } catch (error) {
        if ((error as any).name !== "AbortError") {
          console.error("Failed to fetch authors:", error);
        }
      }
    },
    [fetchWithAuth]
  );

  const fetchPublishers = useCallback(
    async (signal?: AbortSignal) => {
      try {
        const res = await fetchWithAuth(`${config.apiUrl}/library/publishers`, {
          signal,
        });
        if (res.ok) {
          const data = await res.json();
          setPublishers(data.publishers || []);
        }
      } catch (error) {
        if ((error as any).name !== "AbortError") {
          console.error("Failed to fetch publishers:", error);
        }
      }
    },
    [fetchWithAuth]
  );

  const fetchUsers = useCallback(
    async (signal?: AbortSignal) => {
      try {
        const res = await fetchWithAuth(`${config.apiUrl}/auth/users`, {
          signal,
        });
        if (res.ok) {
          const data = await res.json();
          setUsers(data.users || []);
        }
      } catch (error) {
        if ((error as any).name !== "AbortError") {
          console.error("Failed to fetch users:", error);
        }
      }
    },
    [fetchWithAuth]
  );

  const fetchLoggedInUser = useCallback(
    async (signal?: AbortSignal) => {
      try {
        const res = await fetchWithAuth(`${config.apiUrl}/auth/user`, {
          signal,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user || null);
        }
      } catch (error) {
        if ((error as any).name !== "AbortError") {
          console.error("Failed to fetch user:", error);
        }
      }
    },
    [fetchWithAuth]
  );

  // TODO: calling this function on every render is a performance hit
  const fetchAllData = useCallback(
    async (signal?: AbortSignal) => {
      setIsLoading(true);
      try {
        await Promise.allSettled([
          fetchBooks(signal),
          fetchAuthors(signal),
          fetchPublishers(signal),
          fetchUsers(signal),
          fetchLoggedInUser(signal),
        ]);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchBooks, fetchAuthors, fetchPublishers, fetchUsers, fetchLoggedInUser]
  );

  // Initial data fetch
  useEffect(() => {
    if (!accessToken) {
      navigate("/login");
      return;
    }
    fetchAllData();
  }, [accessToken]);

  // Form submission handlers
  const handleBookSubmit = async (bookData: any) => {
    try {
      const createRes = await fetchWithAuth(`${config.apiUrl}/library/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookData),
      });

      if (!createRes.ok) {
        const errorText = await createRes.text();
        throw new Error(errorText || "Failed to create book");
      }

      // After successful creation, fetch fresh data
      await fetchAllData();
      return true;
    } catch (error) {
      console.error("Failed to add book:", error);
      throw error; // Re-throw to handle in the component
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

      // After successful creation, fetch fresh data
      await fetchAllData();
    } catch (error) {
      console.error("Failed to add author:", error);
    }
  };

  const handlePublisherSubmit = async (publisherData: any) => {
    try {
      debugger;
      const res = await fetchWithAuth(`${config.apiUrl}/library/publishers`, {
        method: "POST",
        body: JSON.stringify(publisherData),
      });
      if (res.ok) {
        const newPublisher = await res.json();
        setPublishers((publishers) => [...publishers, newPublisher]);
      }

      // After successful creation, fetch fresh data
      await fetchAllData();
    } catch (error) {
      console.error("Failed to add publisher:", error);
    }
  };

  // Edit handlers
  const handleBookEdit = async (book: any) => {
    try {
      const id = book.id;

      const updateRes = await fetchWithAuth(
        `${config.apiUrl}/library/books/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: book.id,
            title: book.title,
            isbn: book.isbn,
            authorId: book.authorId,
            publisherId: book.publisherId,
            publishedDate: book.publishedDate,
            genre: book.genre,
            pages: book.pages,
            year: book.year,
          }),
        }
      );

      if (!updateRes.ok) {
        const errorText = await updateRes.text();
        console.error("Update failed with response:", errorText); // Debug log
        throw new Error(errorText || "Failed to update book");
      }

      // After successful update, fetch fresh data
      await fetchAllData();
      return true;
    } catch (error) {
      console.error("Failed to update book:", error);
      throw error; // Re-throw to handle in the component
    }
  };

  const handleAuthorEdit = async (author: any) => {
    try {
      const id = author.id;
      const updateRes = await fetchWithAuth(
        `${config.apiUrl}/library/authors/${id}`,
        {
          method: "PUT",
          body: JSON.stringify(author),
        }
      );

      if (!updateRes.ok) {
        const errorText = await updateRes.text();
        console.error("Update failed with response:", errorText); // Debug log
        throw new Error(errorText || "Failed to update author");
      }

      // After successful update, fetch fresh data
      await fetchAllData();
      return true;
    } catch (error) {
      console.error("Failed to update author:", error);
      throw error; // Re-throw to handle in the component
    }
  };

  const handlePublisherEdit = async (publisher: any) => {
    try {
      const id = publisher.id;
      const updateRes = await fetchWithAuth(
        `${config.apiUrl}/library/publishers/${id}`,
        {
          method: "PUT",
          body: JSON.stringify(publisher),
        }
      );

      if (!updateRes.ok) {
        const errorText = await updateRes.text();
        console.error("Update failed with response:", errorText); // Debug log
        throw new Error(errorText || "Failed to update publisher");
      }

      // After successful update, fetch fresh data
      await fetchAllData();
      return true;
    } catch (error) {
      console.error("Failed to update author:", error);
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

  // User handlers
  const handleUserSubmit = async (userData: any): Promise<void> => {
    try {
      const res = await fetchWithAuth(`${config.apiUrl}/auth/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to create user");
      }

      // After successful creation, fetch fresh data
      await fetchAllData();
    } catch (error) {
      console.error("Failed to add user:", error);
      throw error;
    }
  };

  const handleUserEdit = async (user: any): Promise<void> => {
    try {
      const updateRes = await fetchWithAuth(`${config.apiUrl}/auth/users`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (!updateRes.ok) {
        const errorText = await updateRes.text();
        throw new Error(errorText || "Failed to update user");
      }

      // After successful update, fetch fresh data
      await fetchAllData();
    } catch (error) {
      console.error("Failed to update user:", error);
      throw error;
    }
  };

  const handleUserDelete = async (id: string): Promise<void> => {
    try {
      const res = await fetchWithAuth(`${config.apiUrl}/auth/users`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setUsers((prev) => prev.filter((user) => user.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
      throw error;
    }
  };

  async function handleProfileUpdate(data: {
    email: string;
    firstName: string;
    lastName: string;
    // bio?: string | undefined;
  }) {
    try {
      const res = await fetchWithAuth(`${config.apiUrl}/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to update profile");
      }
      // Optionally, you could refresh user data here or show a success message
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to update profile:", error);
      // Optionally, show error feedback to the user
    }
  }

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
            {location.pathname === "/profile" ? (
              <div className="p-6">
                <h3 className="text-lg font-medium mb-4">Profile</h3>
                <ProfileForm
                  user={user}
                  onSubmit={handleProfileUpdate}
                  onCancel={() => navigate("/dashboard")}
                />
              </div>
            ) : (
              <Tabs defaultValue="books" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="books">Books</TabsTrigger>
                  <TabsTrigger value="authors">Authors</TabsTrigger>
                  <TabsTrigger value="publishers">Publishers</TabsTrigger>
                  <TabsTrigger value="users">Users</TabsTrigger>
                </TabsList>{" "}
                <TabsContent value="books" className="mt-6">
                  <div className="gap-6">
                    <div className="lg:col-span-3">
                      <div className="p-6">
                        <h3 className="text-lg font-medium mb-4">Books List</h3>
                        <BooksTable
                          books={books}
                          authors={authors}
                          publishers={publishers}
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
                        <h3 className="text-lg font-medium mb-4">
                          Authors List
                        </h3>
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
                <TabsContent value="users" className="mt-6">
                  <div className="gap-6">
                    <div className="">
                      <div className="p-6">
                        <h3 className="text-lg font-medium mb-4">Users List</h3>
                        <UsersTable
                          users={users}
                          onEdit={handleUserEdit}
                          onDelete={handleUserDelete}
                          onAdd={handleUserSubmit}
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
