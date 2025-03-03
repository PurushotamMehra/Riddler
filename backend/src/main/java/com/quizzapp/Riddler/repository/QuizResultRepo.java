package com.quizzapp.Riddler.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.quizzapp.Riddler.model.QuizResult;

@Repository
public interface QuizResultRepo extends JpaRepository<QuizResult, Long> {
    List<QuizResult> findByStudentId(Long studentId);
    List<QuizResult> findByQuizId(Long quizId);
    Optional<QuizResult> findByStudentIdAndQuizId(Long studentId, Long quizId);

}

