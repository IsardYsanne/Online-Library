package ru.otus.library.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import ru.otus.library.dto.StatisticsDto;
import ru.otus.library.model.entity.Book;
import ru.otus.library.model.entity.ReadStatistics;
import ru.otus.library.model.entity.User;
import ru.otus.library.repository.BookRepository;
import ru.otus.library.repository.StatisticsRepository;
import ru.otus.library.repository.UserRepository;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Objects;

@Slf4j
@Service
public class StatisticsServiceImpl implements StatisticsService {

    private final StatisticsRepository statisticsRepository;

    private final UserRepository userRepository;

    private final BookRepository bookRepository;

    public StatisticsServiceImpl(StatisticsRepository statisticsRepository,
                                 UserRepository userRepository,
                                 BookRepository bookRepository) {
        this.statisticsRepository = statisticsRepository;
        this.userRepository = userRepository;
        this.bookRepository = bookRepository;
    }

    @Override
    public List<ReadStatistics> findAllStatistics() {
        return statisticsRepository.findAll();
    }

    @Override
    public StatisticsDto findStatisticsByUserAndBook(String username, String title) {
        final User user = userRepository.findUserByUserName(username);
        final Book book = bookRepository.findBookByTitle(title);
        final ReadStatistics readStatistics = statisticsRepository.findByUserAndBook(user, book);
        final StatisticsDto statisticsDto = new StatisticsDto();
        if (Objects.nonNull(readStatistics)) {
            statisticsDto.setTitle(title);
            statisticsDto.setUserName(username);
            statisticsDto.setIsBookRead(readStatistics.getIsBookRead());
            return statisticsDto;
        } else {
            log.info("Статистики по пользователю: " + user.getUserName() + " и по книге: " + book.getTitle() +
                    " не существует.");
        }

        return statisticsDto;
    }

    @Override
    public void saveStatistics(StatisticsDto statisticsDto) {
        final Book book = bookRepository.findBookByTitle(statisticsDto.getTitle());
        User user = userRepository.findUserByUserName(statisticsDto.getUserName());

        if (Objects.isNull(user)) {
            user = new User("someuser", "pass", "ROLE_USER");
            userRepository.save(user);
        }

        final DateFormat dateFormat = new SimpleDateFormat("yyyy.MM.dd HH:mm:ss");
        final Date date = new Date();

        final ReadStatistics readStatistics = new ReadStatistics();
        readStatistics.setReadDate(dateFormat.format(date));
        readStatistics.setBook(book);
        readStatistics.setUser(user);
        readStatistics.setIsBookRead(statisticsDto.getIsBookRead());

        statisticsRepository.save(readStatistics);
    }
}
