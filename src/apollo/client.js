import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  Observable,
  gql,
} from '@apollo/client';
let authors = [
  { __typename: 'Author', id: '1', name: 'J.K. Rowling' },
  { __typename: 'Author', id: '2', name: 'George Orwell' },
  { __typename: 'Author', id: '3', name: 'Frank Herbert' },
  { __typename: 'Author', id: '4', name: 'Isaac Asimov' },
];

let books = [
  {
    __typename: 'Book',
    id: '1',
    title: "Harry Potter and the Philosopher's Stone",
    genre: 'Fantasy',
    year: 1997,
    authorId: '1',
  },
  {
    __typename: 'Book',
    id: '2',
    title: 'Harry Potter and the Chamber of Secrets',
    genre: 'Fantasy',
    year: 1998,
    authorId: '1',
  },
  {
    __typename: 'Book',
    id: '3',
    title: '1984',
    genre: 'Dystopia',
    year: 1949,
    authorId: '2',
  },
  {
    __typename: 'Book',
    id: '4',
    title: 'Animal Farm',
    genre: 'Satire',
    year: 1945,
    authorId: '2',
  },
  {
    __typename: 'Book',
    id: '5',
    title: 'Dune',
    genre: 'Sci-Fi',
    year: 1965,
    authorId: '3',
  },
  {
    __typename: 'Book',
    id: '6',
    title: 'Foundation',
    genre: 'Sci-Fi',
    year: 1951,
    authorId: '4',
  },
];

let nextBookId = 7;
let nextAuthorId = 5;

function withAuthor(book) {
  return {
    ...book,
    author: authors.find((a) => a.id === book.authorId) || null,
  };
}

const resolvers = {
  books: () => books.map(withAuthor),
  book: ({ id }) => {
    const b = books.find((b) => b.id === id);
    return b ? withAuthor(b) : null;
  },
  authors: () => authors,
  booksByGenre: ({ genre }) =>
    books
      .filter((b) => b.genre.toLowerCase() === genre.toLowerCase())
      .map(withAuthor),
  addBook: ({ title, genre, year, authorId }) => {
    const author = authors.find((a) => a.id === authorId);
    if (!author) throw new Error(`Author ${authorId} not found`);
    const nb = {
      __typename: 'Book',
      id: String(nextBookId++),
      title,
      genre,
      year: year || null,
      authorId,
    };
    books.push(nb);
    return { ...nb, author };
  },
  deleteBook: ({ id }) => {
    const book = books.find((b) => b.id === id);
    if (!book) throw new Error(`Book ${id} not found`);
    books = books.filter((b) => b.id !== id);
    return withAuthor(book);
  },
  addAuthor: ({ name }) => {
    const a = { __typename: 'Author', id: String(nextAuthorId++), name };
    authors.push(a);
    return a;
  },
};
const MockLink = new ApolloLink((operation, _forward) => {
  return new Observable((observer) => {
    const timer = setTimeout(() => {
      try {
        const { query, variables } = operation;
        const definition = query.definitions.find(
          (d) => d.kind === 'OperationDefinition'
        );

        if (!definition) {
          throw new Error('No operation definition found');
        }
        const data = {};
        for (const selection of definition.selectionSet.selections) {
          if (selection.kind !== 'Field') continue;

          const fieldName = selection.name.value;

          if (resolvers[fieldName]) {
            data[fieldName] = resolvers[fieldName](variables || {});
          }
        }

        observer.next({ data });
        observer.complete();
      } catch (err) {
        observer.error(err);
      }
    }, 300);

    return () => clearTimeout(timer);
  });
});
const client = new ApolloClient({
  link: MockLink,
  cache: new InMemoryCache(),
});

export default client;
