package ru.otus.library.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.otus.library.dto.BookDto;
import ru.otus.library.dto.BookFileDto;
import ru.otus.library.dto.BookLinkDto;
import ru.otus.library.dto.BookTitleDto;
import ru.otus.library.model.entity.Author;
import ru.otus.library.model.entity.Book;
import ru.otus.library.model.entity.Genre;
import ru.otus.library.model.entity.ReadStatistics;
import ru.otus.library.repository.AuthorRepository;
import ru.otus.library.repository.BookRepository;
import ru.otus.library.repository.GenreRepository;
import ru.otus.library.repository.StatisticsRepository;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.text.SimpleDateFormat;
import java.util.Collections;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@Slf4j
@Service
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;

    private final AuthorRepository authorRepository;

    private final GenreRepository genreRepository;

    private final StatisticsRepository statisticsRepository;

    private static final String IMAGES_FOLDER = "src/main/resources/covers/";

    private static final String BOOKS_FOLDER = "src/ui/src/";

    public BookServiceImpl(final BookRepository bookRepository,
                           final AuthorRepository authorRepository,
                           final GenreRepository genreRepository,
                           final StatisticsRepository statisticsRepository) {
        this.bookRepository = bookRepository;
        this.authorRepository = authorRepository;
        this.genreRepository = genreRepository;
        this.statisticsRepository = statisticsRepository;
    }

    @Override
    public Book findBookById(Long id) {
        return bookRepository.findById(id).orElseThrow();
    }

    @Override
    public List<Book> findAllBooks() {
        return bookRepository.findAll();
    }

    @Override
    public List<Book> findBooksByAuthorsName(final String name) {
        final Author author = authorRepository.findAuthorByName(name);
        if (author == null) {
            return Collections.emptyList();
        }
        return bookRepository.findBooksByAuthorId(author.getId());
    }

    @Override
    public List<Book> findBooksByAuthorId(Long authorId) {
        return bookRepository.findBooksByAuthorId(authorId);
    }

    @Override
    public List<Book> findBooksByTitle(String title) {
        return bookRepository.findBooksByTitle(title);
    }

    @Override
    public List<String> findAllTitles() {
        return bookRepository.findAllTitles();
    }

    @Transactional
    @Override
    public Book saveNewBook(Book book) {
        Genre genre = genreRepository.findByName(book.getGenre().getName());
        if (genre == null) {
            genre = genreRepository.save(book.getGenre());
        }
        book.setGenre(genre);

        final Set<Author> authorSet = new HashSet<>();
        for (Author author : book.getAuthors()) {
            Author checkAuthor = authorRepository.findAuthorByName(author.getName());
            if (checkAuthor == null) {
                author = authorRepository.save(author);
                author.getBooks().add(book);
                authorSet.add(author);
            } else {
                checkAuthor.getBooks().add(book);
                authorSet.add(checkAuthor);
            }
        }
        book.setAuthors(authorSet);
        convertByteToImageAndSaveToFolder(book);
        return bookRepository.save(book);
    }

    @Override
    public void saveBookFilePdf(BookFileDto bookFileDto) {
        final File file = new File(bookFileDto.getBookName() + ".pdf");
        final Book book = bookRepository.findBookByTitle(bookFileDto.getBookName());
        try (OutputStream out = new FileOutputStream(BOOKS_FOLDER + file)) {
            out.write(bookFileDto.getPdfBook());
            book.setBookPath(BOOKS_FOLDER + file);
            bookRepository.save(book);
        }  catch (IOException e) {
            log.error("Ошибка в записи файла: " + e.getMessage());
        }
    }

    @Override
    public BookLinkDto sendBookLink(BookTitleDto bookTitleDto) {
        final Book book = bookRepository.findBookByTitle(bookTitleDto.getBookName());
        final BookLinkDto bookLinkDto = new BookLinkDto();
        bookLinkDto.setLink(book.getBookPath());
        return bookLinkDto;
    }

    @Override
    public Book updateBook(final BookDto bookDto) {
        final Book book = bookRepository.findById(bookDto.getId()).orElse(null);
        if (Objects.nonNull(book)) {
            book.setTitle(bookDto.getTitle());
            book.setImage(bookDto.getBase64URL());
            bookRepository.save(book);
        }
        return book;
    }

    @Override
    public Book updateBookImage(BookDto bookDto) {
        final Book book = bookRepository.findById(bookDto.getId()).orElse(null);
        if (bookDto.getIsDeleteImage() && Objects.nonNull(book)) {
            book.setImage(null);
            bookRepository.save(book);
        }
        return book;
    }

    @Override
    public void deleteBookById(final Long id) {
        final Book book = bookRepository.findById(id).orElse(null);
        final List<ReadStatistics> statistics = statisticsRepository.findAllByBook(book);
        statistics.forEach(statistic -> statisticsRepository.delete(statistic));
        bookRepository.deleteById(id);
    }

    @Override
    public void deleteAll() {
        bookRepository.deleteAll();
    }

    public void convertByteToImageAndSaveToFolder(final Book book) {
        final Date date = new Date();
        final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd_HH-mm-ss");
        final File file = new File(dateFormat.format(date) + ".jpg");

        try (OutputStream stream = new FileOutputStream(IMAGES_FOLDER + file)) {
            stream.write(book.getImage());
        } catch (IOException e) {
            log.error("Ошибка в записи изображения: " + e.getMessage());
        }
    }
}
