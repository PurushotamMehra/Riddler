package com.quizzapp.Riddler.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.quizzapp.Riddler.model.Quiz;
import com.quizzapp.Riddler.model.QuizResult;
import com.quizzapp.Riddler.service.QuizService;

import java.util.List;

@RestController
@RequestMapping("/api/teacher")
@RequiredArgsConstructor
public class TeacherController {
    private final QuizService quizService;
    
    @PostMapping("/quizzes")
    public ResponseEntity<?> createQuiz(@RequestBody Quiz quiz) {
        try {
            return ResponseEntity.ok(quizService.createQuiz(quiz));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error creating quiz: " + e.getMessage());
        }
    }
    
    @GetMapping("/quizzes/{teacherId}")
    public ResponseEntity<?> getTeacherQuizzes(@PathVariable Long teacherId) {
        try {
            List<Quiz> quizzes = quizService.getQuizzesByTeacher(teacherId);
            if (quizzes.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body("No quizzes found for teacher ID " + teacherId);
            }
            return ResponseEntity.ok(quizzes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving quizzes: " + e.getMessage());
        }
    }
    
    @GetMapping("/results/{quizId}")
    public ResponseEntity<?> getQuizResults(@PathVariable Long quizId) {
        try {
            List<QuizResult> results = quizService.getQuizResults(quizId);
            if (results.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body("No results found for quiz ID " + quizId);
            }
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving quiz results: " + e.getMessage());
        }
    }

    // controllers/TeacherController.java
    @GetMapping("/quizzesquest/{id}")
    public ResponseEntity<Quiz> getQuiz(@PathVariable Long id) {
        return ResponseEntity.ok(quizService.getQuizById(id));
    }
}
