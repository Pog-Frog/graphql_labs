import { gql, useMutation } from "@apollo/client";
import { useState } from "react";

const ADD_BOOK = gql`
  mutation AddBook($title: String!, $author: String!, $publishedYear: Int, $genre: String) {
    addBook(title: $title, author: $author, publishedYear: $publishedYear, genre: $genre) {
      id
      title
      author
      publishedYear
      genre
    }
  }
`;

const GET_ALL_BOOKS = gql`
  query {
    books {
      id
      title
      author
      publishedYear
      genre
    }
  }
`;

interface AddBookFormProps {
  onBookAdded?: () => void;
}

export default function AddBookForm({ onBookAdded }: AddBookFormProps) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [publishedYear, setPublishedYear] = useState("");
  const [genre, setGenre] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const [addBook, { loading, error }] = useMutation(ADD_BOOK, {
    refetchQueries: [{ query: GET_ALL_BOOKS }],
    onCompleted: () => {
      setTitle("");
      setAuthor("");
      setPublishedYear("");
      setGenre("");
      setIsOpen(false);
      onBookAdded?.();
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim()) return;

    addBook({
      variables: {
        title: title.trim(),
        author: author.trim(),
        publishedYear: publishedYear ? parseInt(publishedYear) : null,
        genre: genre.trim() || null
      }
    });
  };

  if (!isOpen) {
    return (
      <div className="add-book-button-container">
        <button 
          className="add-book-button"
          onClick={() => setIsOpen(true)}
        >
          + Add New Book
        </button>
      </div>
    );
  }

  return (
    <div className="add-book-form-container">
      <form onSubmit={handleSubmit} className="add-book-form">
        <h3>Add New Book</h3>
        
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter book title"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="author">Author *</label>
          <input
            id="author"
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Enter author name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="publishedYear">Published Year</label>
          <input
            id="publishedYear"
            type="number"
            value={publishedYear}
            onChange={(e) => setPublishedYear(e.target.value)}
            placeholder="e.g., 2023"
            min="1000"
            max={new Date().getFullYear()}
          />
        </div>

        <div className="form-group">
          <label htmlFor="genre">Genre</label>
          <input
            id="genre"
            type="text"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            placeholder="e.g., Fiction, Science Fiction"
          />
        </div>

        {error && (
          <div className="form-error">
            Error: {error.message}
          </div>
        )}

        <div className="form-buttons">
          <button 
            type="submit" 
            disabled={loading || !title.trim() || !author.trim()}
            className="submit-button"
          >
            {loading ? "Adding..." : "Add Book"}
          </button>
          <button 
            type="button" 
            onClick={() => setIsOpen(false)}
            className="cancel-button"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
