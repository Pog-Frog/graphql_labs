import { gql, useQuery } from "@apollo/client"
import './App.css'
import AddBookForm from './AddBookForm'

interface Book {
  id: string;
  title: string;
  author: string;
  publishedYear?: number;
  genre?: string;
}

interface BooksData {
  books: Book[];
}

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
`

function App() {

  const { loading, error, data } = useQuery<BooksData>(GET_ALL_BOOKS);

  if (loading) return <div className="loading">Loading books...</div>
  if (error) return <div className="error">Error loading books: {error.message}</div>

  return (
    <div>
      <h1 className="books-header">📚 Books Library</h1>
      
      <AddBookForm />
      
      {data?.books && data.books.length > 0 ? (
        <div className="books-container">
          {data.books.map((book: Book) => (
            <div key={book.id} className="book-card">
              <h3 className="book-title">{book.title}</h3>
              <p className="book-detail"><strong>Author:</strong> {book.author}</p>
              {book.publishedYear && (
                <p className="book-detail"><strong>Published:</strong> {book.publishedYear}</p>
              )}
              {book.genre && (
                <p className="book-detail"><strong>Genre:</strong> {book.genre}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="no-books">No books found</div>
      )}
    </div>
  )
}

export default App
