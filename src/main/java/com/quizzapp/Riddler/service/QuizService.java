package com.quizzapp.Riddler.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.quizzapp.Riddler.model.*;
import com.quizzapp.Riddler.repository.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class QuizService {
    private final QuizRepo quizRepository;
    private final QuizResultRepo quizResultRepository;
    private final UserRepo userRepository;
    
    // services/QuizService.java
    public Quiz createQuiz(Quiz quiz) {
        if (quiz.getQuestions().size() > 30) {
            throw new RuntimeException("Quiz cannot have more than 30 questions");
        }
        
        // Validate questions
        for (Question question : quiz.getQuestions()) {
            if (question.getCorrectOption() == null || 
                question.getCorrectOption() < 1 || 
                question.getCorrectOption() > 4) {
                throw new RuntimeException("Correct option must be between 1 and 4");
            }
            
            if (question.getOption1() == null || question.getOption2() == null ||
                question.getOption3() == null || question.getOption4() == null) {
                throw new RuntimeException("All four options are required");
            }
            
            // Set the quiz reference for each question
            question.setQuiz(quiz);
        }
        
        return quizRepository.save(quiz);
    }

    // Add this method to get a quiz with its questions
    public Quiz getQuizById(Long id) {
        return quizRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Quiz not found"));
    }
    
    public QuizResult submitQuiz(Long quizId, Long studentId, List<Integer> answers) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        if (answers.size() != quiz.getQuestions().size()) {
            throw new RuntimeException("Number of answers does not match number of questions");
        }

        // Create quiz result
        QuizResult result = new QuizResult();
        result.setQuiz(quiz);
        result.setStudent(student);
        result.setSubmissionTime(LocalDateTime.now());
        result.setAnswersAsList(answers); // Store the answers

        // Calculate score
        int score = 0;
        List<Question> questions = quiz.getQuestions();
        
        for (int i = 0; i < questions.size(); i++) {
            if (questions.get(i).getCorrectOption().equals(answers.get(i))) {
                score++;
            }
        }

        result.setScore(score);
        return quizResultRepository.save(result);
    }

    // Helper method to get correct/incorrect answers for a quiz result
    public Map<Long, Boolean> getAnswerAnalysis(Long quizResultId) {
        QuizResult result = quizResultRepository.findById(quizResultId)
                .orElseThrow(() -> new RuntimeException("Quiz result not found"));
        
        Map<Long, Boolean> answerAnalysis = new HashMap<>();
        List<Question> questions = result.getQuiz().getQuestions();
        List<Integer> studentAnswers = result.getAnswersAsList();
        
        for (int i = 0; i < questions.size(); i++) {
            Question question = questions.get(i);
            boolean isCorrect = question.getCorrectOption().equals(studentAnswers.get(i));
            answerAnalysis.put(question.getId(), isCorrect);
        }
        
        return answerAnalysis;
    }
    
    public List<Quiz> getQuizzesByTeacher(Long teacherId) {
        return quizRepository.findByTeacherId(teacherId);
    }
    
    public List<QuizResult> getQuizResults(Long quizId) {
        return quizResultRepository.findByQuizId(quizId);
    }
    
    public List<QuizResult> getStudentResults(Long studentId) {
        return quizResultRepository.findByStudentId(studentId);
    }
}