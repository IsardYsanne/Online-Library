package ru.otus.library.repository;

import org.springframework.data.repository.CrudRepository;
import ru.otus.library.model.entity.Book;
import ru.otus.library.model.entity.ReadStatistics;
import ru.otus.library.model.entity.User;

import java.util.List;

public interface StatisticsRepository extends CrudRepository<ReadStatistics, Long> {

    List<ReadStatistics> findAll();

    ReadStatistics findByUserAndBook(User user, Book book);

    List<ReadStatistics> findAllByBook(Book book);
}
