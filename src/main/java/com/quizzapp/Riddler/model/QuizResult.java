package com.quizzapp.Riddler.model;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "quiz_result")
public class QuizResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Quiz quiz;

    @ManyToOne
    private User student;

    private int score;
    private LocalDateTime submissionTime;

    // Store answers as a JSON string
    @Column(columnDefinition = "TEXT")
    private String selectedAnswers;

    // Transient field for easy access to answers as a List
    @Transient
    private List<Integer> answersAsList;

    // Getter and setter for answers that handle JSON conversion
    public List<Integer> getAnswersAsList() {
        if (answersAsList == null && selectedAnswers != null) {
            try {
                ObjectMapper mapper = new ObjectMapper();
                answersAsList = mapper.readValue(selectedAnswers, new TypeReference<List<Integer>>() {});
            } catch (JsonProcessingException e) {
                throw new RuntimeException("Error converting answers from JSON", e);
            }
        }
        return answersAsList;
    }

    public void setAnswersAsList(List<Integer> answers) {
        this.answersAsList = answers;
        try {
            ObjectMapper mapper = new ObjectMapper();
            this.selectedAnswers = mapper.writeValueAsString(answers);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error converting answers to JSON", e);
        }
    }
}
