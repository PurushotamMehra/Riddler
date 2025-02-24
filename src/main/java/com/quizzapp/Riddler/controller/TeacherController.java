package com.quizzapp.Riddler.controller;

import com.quizzapp.Riddler.model.Quiz;
import com.quizzapp.Riddler.model.QuizResult;
import com.quizzapp.Riddler.service.QuizService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teacher")
public class TeacherController {

    @Autowired
    private QuizService quizService;

    @PostMapping("/quiz") //WORKS
    public ResponseEntity<Quiz> createQuiz(@RequestBody Quiz quiz) {
        return ResponseEntity.ok(quizService.createQuiz(quiz));
    }

    @GetMapping("/quiz/{teacherId}") //WORKS with and without security
    public ResponseEntity<List<Quiz>> getTeacherQuizzes(@PathVariable Long teacherId) {
        List<Quiz> quizzes = quizService.getQuizzesByTeacher(teacherId);
        return ResponseEntity.ok(quizzes);
    }

    @GetMapping("/results/{quizId}") //WORKS
    public ResponseEntity<List<QuizResult>> getQuizResults(@PathVariable Long quizId) {
        List<QuizResult> results = quizService.getQuizResults(quizId);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/quizzesquest/{id}") //WORKS
    public ResponseEntity<Quiz> getQuiz(@PathVariable Long id) {
        return ResponseEntity.ok(quizService.getQuizById(id));
    }
}
