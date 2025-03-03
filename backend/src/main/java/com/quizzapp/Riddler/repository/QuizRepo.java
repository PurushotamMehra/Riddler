package com.quizzapp.Riddler.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.quizzapp.Riddler.model.Quiz;

@Repository
public interface QuizRepo extends JpaRepository <Quiz, Long> {
    List<Quiz> findByTeacherId(Long teacherId);
}
