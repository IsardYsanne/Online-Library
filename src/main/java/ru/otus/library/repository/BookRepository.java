package ru.otus.library.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ru.otus.library.model.entity.Book;

import java.util.List;

public interface BookRepository extends CrudRepository<Book, Long> {

    List<Book> findAll();

    @Query("SELECT b FROM Book b JOIN b.authors a WHERE a.id = :id")
    List<Book> findBooksByAuthorId(@Param(value = "id") Long authorId);

    List<Book> findBooksByTitle(final String title);

    Book findBookByTitle(final String title);

    @Query("SELECT b.title FROM Book b")
    List<String> findAllTitles();
}
