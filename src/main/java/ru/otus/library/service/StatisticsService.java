package ru.otus.library.service;

import ru.otus.library.dto.StatisticsDto;

public interface StatisticsService {

    StatisticsDto findStatisticsByUserAndBook(final String username, final String title);

    void saveStatistics(final StatisticsDto statisticsDto);
}
