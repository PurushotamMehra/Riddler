package com.quizzapp.Riddler.controller;

import com.quizzapp.Riddler.model.Quiz;
import com.quizzapp.Riddler.model.QuizResult;
import com.quizzapp.Riddler.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
@RestController
@RequestMapping("/api/student")
public class StudentController {
    @Autowired
    private QuizService quizService;
    
    @PostMapping("/quiz/{quizId}/submit/{studentId}")
    public ResponseEntity<QuizResult> submitQuiz(
        @PathVariable Long quizId,
        @PathVariable Long studentId,
        @RequestBody List<Integer> answers) {
        return ResponseEntity.ok(quizService.submitQuiz(quizId, studentId, answers));
    }
    
    @GetMapping("/results/{studentId}")
    public ResponseEntity<List<QuizResult>> getStudentResults(@PathVariable Long studentId) {
        return ResponseEntity.ok(quizService.getStudentResults(studentId));
    }
    
    @GetMapping("/quiz/{quizId}")
    public ResponseEntity<Quiz> getQuizById(@PathVariable Long quizId) {
        return ResponseEntity.ok(quizService.getQuizById(quizId));
    }
    
    @GetMapping("/results/{studentId}/quiz/{quizId}")
    public ResponseEntity<QuizResult> getStudentQuizResult(
        @PathVariable Long studentId,
        @PathVariable Long quizId) {
        return ResponseEntity.ok(quizService.getStudentQuizResult(studentId, quizId));
    }
    
    @GetMapping("/quizzes")
    public ResponseEntity<List<Quiz>> getAllQuizzes() {
        return ResponseEntity.ok(quizService.getAllQuizzes());
    }
    
    @GetMapping("/result/{resultId}")
    public ResponseEntity<QuizResult> getQuizResultById(@PathVariable Long resultId) {
        return ResponseEntity.ok(quizService.getQuizResultById(resultId));
    }
    
    @GetMapping("/quiz/{quizId}/results")
    public ResponseEntity<List<QuizResult>> getQuizResults(@PathVariable Long quizId) {
        return ResponseEntity.ok(quizService.getQuizResults(quizId));
    }
}