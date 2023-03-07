package ru.otus.library.service;

import ru.otus.library.dto.StatisticsDto;
import ru.otus.library.model.entity.ReadStatistics;

import java.util.List;

public interface StatisticsService {

    List<ReadStatistics> findAllStatistics();

    StatisticsDto findStatisticsByUserAndBook(final String username, final String title);

    void saveStatistics(final StatisticsDto statisticsDto);
}
