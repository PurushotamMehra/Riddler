package com.quizzapp.Riddler.controller;


import com.quizzapp.Riddler.model.QuizResult;
import com.quizzapp.Riddler.service.QuizService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
public class StudentController {
    private final QuizService quizService;
    
    @PostMapping("/quizzes/{quizId}/submit/{studentId}")
    public ResponseEntity<QuizResult> submitQuiz(
            @PathVariable Long quizId, //Change to request param
            @PathVariable Long studentId, //change this to request param
            @RequestBody List<Integer> answers) {
        return ResponseEntity.ok(quizService.submitQuiz(quizId, studentId, answers));
    }
    
    @GetMapping("/results/{studentId}")
    public ResponseEntity<List<QuizResult>> getStudentResults(@PathVariable Long studentId) { // change to request param
        return ResponseEntity.ok(quizService.getStudentResults(studentId));
    }
}