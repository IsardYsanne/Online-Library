package ru.otus.library.controller;

import io.swagger.annotations.Api;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.otus.library.dto.StatisticsDto;
import ru.otus.library.service.StatisticsService;

@CrossOrigin
@RestController
@RequestMapping("/statistics")
@Slf4j
@Api(tags = {"Контроллер для Статистики"})
public class StatisticsController {

    private final StatisticsService statisticsService;

    public StatisticsController(StatisticsService statisticsService) {
        this.statisticsService = statisticsService;
    }

    @PostMapping("/save")
    public ResponseEntity<Void> saveNewStatistics(@RequestBody StatisticsDto statisticsDto) {
        statisticsService.saveStatistics(statisticsDto);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/show/{username}/{title}")
    public ResponseEntity<StatisticsDto> findStatisticsByUserNameAndBookTitle(@PathVariable("username") String username,
                                                                              @PathVariable("title") String title) {
        return ResponseEntity.ok(statisticsService.findStatisticsByUserAndBook(username, title));
    }
}
