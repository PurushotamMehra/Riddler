package com.quizzapp.Riddler.service.ServiceImpl;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.quizzapp.Riddler.model.*;
import com.quizzapp.Riddler.repository.*;
import com.quizzapp.Riddler.service.QuizService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.time.LocalDateTime;

@Service
public class QuizServiceImpl implements QuizService {
    
    @Autowired private QuizRepo quizRepository;
    @Autowired private QuizResultRepo quizResultRepository;
    @Autowired private UserRepo userRepository;

    @Override
    public Quiz createQuiz(Quiz quiz) {
        if (quiz.getQuestions().size() > 30) {
            throw new IllegalArgumentException("Quiz cannot have more than 30 questions");
        }

        for (Question question : quiz.getQuestions()) {
            if (question.getCorrectOption() == null || question.getCorrectOption() < 1 || question.getCorrectOption() > 4) {
                throw new IllegalArgumentException("Correct option must be between 1 and 4");
            }
            if (question.getOption1() == null || question.getOption2() == null || question.getOption3() == null || question.getOption4() == null) {
                throw new IllegalArgumentException("All four options are required for question ID " + question.getId());
            }
            question.setQuiz(quiz);
        }
        
        return quizRepository.save(quiz);
    }

    @Override
    public Quiz getQuizById(Long id) {
        return quizRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Quiz with ID " + id + " not found"));
    }

    @Override
    public QuizResult submitQuiz(Long quizId, Long studentId, List<Integer> answers) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new EntityNotFoundException("Quiz with ID " + quizId + " not found"));
        
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new EntityNotFoundException("Student with ID " + studentId + " not found"));

        if (answers.size() != quiz.getQuestions().size()) {
            throw new IllegalArgumentException("Number of answers provided (" + answers.size() + 
                ") does not match number of questions (" + quiz.getQuestions().size() + ")");
        }

        QuizResult result = new QuizResult();
        result.setQuiz(quiz);
        result.setStudent(student);
        result.setSubmissionTime(LocalDateTime.now());
        result.setAnswersAsList(answers);

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

    @Override
    public Map<Long, Boolean> getAnswerAnalysis(Long quizResultId) {
        QuizResult result = quizResultRepository.findById(quizResultId)
                .orElseThrow(() -> new EntityNotFoundException("Quiz result with ID " + quizResultId + " not found"));

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

    @Override
    public List<Quiz> getQuizzesByTeacher(Long teacherId) {
        return quizRepository.findByTeacherId(teacherId);
    }

    @Override
    public List<QuizResult> getQuizResults(Long quizId) {
        return quizResultRepository.findByQuizId(quizId);
    }

    @Override
    public List<QuizResult> getStudentResults(Long studentId) {
        return quizResultRepository.findByStudentId(studentId);
    }

    @Override
    public QuizResult getStudentQuizResult(Long studentId, Long quizId) {
        return quizResultRepository.findByStudentIdAndQuizId(studentId, quizId)
            .orElseThrow(() -> new EntityNotFoundException("Quiz result not found for student ID " + studentId + " and quiz ID " + quizId));
    }

    @Override
    public List<Quiz> getAllQuizzes() {
        return quizRepository.findAll();
    }
    
    @Override
    public QuizResult getQuizResultById(Long resultId) {
        return quizResultRepository.findById(resultId)
            .orElseThrow(() -> new EntityNotFoundException("Quiz result with ID " + resultId + " not found"));
    }
}