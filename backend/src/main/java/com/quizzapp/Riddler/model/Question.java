package com.quizzapp.Riddler.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "question")
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String questionText;
    private String option1;
    private String option2;
    private String option3;
    private String option4;
    private Integer correctOption; // 1-4
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id")
    @JsonIgnore  // This prevents infinite recursion in JSON serialization
    private Quiz quiz;
}
