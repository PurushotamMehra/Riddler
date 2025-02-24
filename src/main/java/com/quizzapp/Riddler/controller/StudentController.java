package com.quizzapp.Riddler.controller;

import com.quizzapp.Riddler.model.Quiz;
import com.quizzapp.Riddler.model.QuizResult;
import com.quizzapp.Riddler.service.QuizService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student")
public class StudentController {

    @Autowired
    private QuizService quizService;

    @PostMapping("/quiz/{quizId}/submit/{studentId}") //WORKS
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

    @GetMapping("/quiz/{quizId}") //WORKS works with security
    public ResponseEntity<Quiz> getQuizById(@PathVariable Long quizId) {
        return ResponseEntity.ok(quizService.getQuizById(quizId));
    }
//     @GetMapping("/quiz/{quizId}")
// public ResponseEntity<String> getQuizById(@PathVariable Long quizId) {
//     try {
//         Quiz quiz = quizService.getQuizById(quizId);
//         return ResponseEntity.ok("Quiz found with ID: " + quizId);
//     } catch (Exception e) {
//         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//             .body("Error finding quiz: " + e.getMessage());
//     }
// }

    @GetMapping("/results/{studentId}/quiz/{quizId}") //WORKS BUT NEED TO MAKE SURE ONLY ONE ENTRY IS MADE BY ONE QUIZ
    public ResponseEntity<QuizResult> getStudentQuizResult(
            @PathVariable Long studentId, 
            @PathVariable Long quizId) {
        return ResponseEntity.ok(quizService.getStudentQuizResult(studentId, quizId));
    }

    @GetMapping("/test")
public ResponseEntity<String> test() {
    return ResponseEntity.ok("Security is working!");
}
}
