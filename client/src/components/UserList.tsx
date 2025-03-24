// src/components/UserList.tsx
import React, { useState, useEffect, useCallback, memo } from 'react';
import { fetchUsers, PaginatedUsers, User } from '../services/userService';

// Define a type for storing each page's data
interface PageData {
  users: User[];
  nextCursor: number | null;
}

// Memoized row component to avoid unnecessary re-renders
const Row: React.FC<{ user: User }> = memo(({ user }) => (
  <div key={user.user_id} className="border rounded p-4 shadow">
    <p><strong>ID:</strong> {user.user_id}</p>
    <p><strong>Name:</strong> {user.name}</p>
    <p><strong>Email:</strong> {user.email}</p>
    <p><strong>Created:</strong> {new Date(user.created_at).toLocaleString()}</p>
  </div>
));

const UserList: React.FC = () => {
  // Array of pages, each containing users and the cursor for the next page.
  const [pages, setPages] = useState<PageData[]>([]);
  // The current page index (0-based)
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load a page:
  // - If the page is already in history, simply update currentPage.
  // - Otherwise, fetch a new page using the last page's nextCursor.
  const loadPage = useCallback(async (pageIndex: number) => {
    setLoading(true);
    setError(null);
    try {
      if (pageIndex < pages.length) {
        // The page was already fetched; just update current page index.
        setCurrentPage(pageIndex);
      } else {
        // Fetch new page using the nextCursor from the last page, or undefined for first page.
        const cursor = pages.length > 0 ? pages[pages.length - 1].nextCursor : undefined;
        const result: PaginatedUsers = await fetchUsers(cursor === null ? undefined : cursor);
        const newPage: PageData = {
          users: result.data,
          nextCursor: result.nextCursor,
        };
        setPages((prevPages) => [...prevPages, newPage]);
        setCurrentPage(pageIndex);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  }, [pages]);

  // Initial load on mount (first page)
  useEffect(() => {
    if (pages.length === 0) {
      loadPage(0);
    }
  }, [pages, loadPage]);

  // Get the data for the current page
  const currentData = pages[currentPage];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">User List (Cursor-Based Pagination)</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {currentData && currentData.users.length === 0 && !loading && (
        <p>No users found.</p>
      )}

      {currentData && (
        <div className="space-y-4">
          {currentData.users.map((user) => (
            <Row key={user.user_id} user={user} />
          ))}
        </div>
      )}

      <div className="mt-4 flex space-x-4">
        <button
          onClick={() => loadPage(currentPage - 1)}
          disabled={currentPage === 0 || loading}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>Page {currentPage + 1}</span>
        <button
          onClick={() => loadPage(currentPage + 1)}
          disabled={!currentData || currentData.nextCursor === null || loading}
          className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UserList;
