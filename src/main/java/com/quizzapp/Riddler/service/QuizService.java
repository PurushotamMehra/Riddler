package com.quizzapp.Riddler.service;

import com.quizzapp.Riddler.model.Quiz;
import com.quizzapp.Riddler.model.QuizResult;

import java.util.List;
import java.util.Map;

public interface QuizService {

    Quiz createQuiz(Quiz quiz);

    Quiz getQuizById(Long id);

    QuizResult submitQuiz(Long quizId, Long studentId, List<Integer> answers);

    Map<Long, Boolean> getAnswerAnalysis(Long quizResultId);

    List<Quiz> getQuizzesByTeacher(Long teacherId);

    List<QuizResult> getQuizResults(Long quizId);

    List<QuizResult> getStudentResults(Long studentId);

    QuizResult getStudentQuizResult(Long studentId, Long quizId);
}
