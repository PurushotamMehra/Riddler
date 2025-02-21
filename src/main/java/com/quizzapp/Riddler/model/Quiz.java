package com.quizzapp.Riddler.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "quizzes")
public class Quiz {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String title;
    private Integer duration; // in minutes
    
    @ManyToOne
    private User teacher;
    
    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL)
    private List<Question> questions = new ArrayList<>();

    // Helper method to maintain bidirectional relationship
    public void addQuestion(Question question) {
        questions.add(question);
        question.setQuiz(this);
    }
}


