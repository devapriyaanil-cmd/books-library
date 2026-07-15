import { gql } from '@apollo/client';

export const ADD_BOOK = gql`
  mutation AddBook($title: String!, $genre: String!, $year: Int, $authorId: ID!) {
    addBook(title: $title, genre: $genre, year: $year, authorId: $authorId) {
      id
      title
      genre
      year
      author {
        id
        name
      }
    }
  }
`;

export const DELETE_BOOK = gql`
  mutation DeleteBook($id: ID!) {
    deleteBook(id: $id) {
      id
      title
    }
  }
`;

export const ADD_AUTHOR = gql`
  mutation AddAuthor($name: String!) {
    addAuthor(name: $name) {
      id
      name
    }
  }
`;
