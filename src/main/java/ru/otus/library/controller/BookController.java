package ru.otus.library.controller;

import io.swagger.annotations.Api;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ru.otus.library.dto.BookDto;
import ru.otus.library.dto.BookFileDto;
import ru.otus.library.dto.BookLinkDto;
import ru.otus.library.dto.BookTitleDto;
import ru.otus.library.mapper.BookMapper;
import ru.otus.library.model.entity.Book;
import ru.otus.library.service.BookService;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/books")
@Slf4j
@Api(tags = {"Контроллер для Книг"})
public class BookController {

    private final BookService bookService;

    private final BookMapper bookMapper;

    public BookController(BookService bookService, BookMapper bookMapper) {
        this.bookService = bookService;
        this.bookMapper = bookMapper;
    }

    @GetMapping("/show_all")
    public ResponseEntity<List<BookDto>> showAllBooks() {
        return ResponseEntity.ok(bookMapper.bookListToDto(bookService.findAllBooks()));
    }

    @GetMapping("/show")
    public ResponseEntity<BookDto> showBookForEdit(@RequestParam(name = "id") Long id) {
        return ResponseEntity.ok(bookMapper.bookToDto(bookService.findBookById(id)));
    }

    @PostMapping("/save")
    public ResponseEntity<BookDto> addNewBook(@RequestBody BookDto bookDto) {
        final Book book = bookService.saveNewBook(bookMapper.dtoToBook(bookDto));
        return book.getId() != null ?
                new ResponseEntity<>(bookMapper.bookToDto(book), HttpStatus.OK) :
                new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping("/save_pdf")
    public ResponseEntity<Void> addNewBookFilePdf(@RequestBody BookFileDto bookFileDto) {
        bookService.saveBookFilePdf(bookFileDto);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/get_link")
    public String sendBookLink(@RequestBody BookTitleDto bookTitleDto) {
        final BookLinkDto bookLinkDto = bookService.sendBookLink(bookTitleDto);
        return bookLinkDto.getLink();
    }

    @PutMapping("/update")
    public ResponseEntity<BookDto> updateBook(@RequestBody BookDto bookDto) {
        final Book book = bookService.updateBook(bookDto);
        return ResponseEntity.ok(bookMapper.bookToDto(book));
    }

    @PutMapping("/update_image")
    public ResponseEntity<BookDto> updateBookImage(@RequestBody BookDto bookDto) {
        final Book book = bookService.updateBookImage(bookDto);
        return ResponseEntity.ok(bookMapper.bookToDto(book));
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Void> deleteBook(@RequestParam(name = "id") Long id) {
        bookService.deleteBookById(id);
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/{bookId}")
    public BookDto showBookById(@PathVariable("bookId") Long bookId) {
        return bookMapper.bookToDto(bookService.findBookById(bookId));
    }
}
