package com.quizzapp.Riddler.controller;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.quizzapp.Riddler.model.Question;
import com.quizzapp.Riddler.model.Quiz;
import com.quizzapp.Riddler.model.QuizResult;
import com.quizzapp.Riddler.model.Role;
import com.quizzapp.Riddler.model.User;
import com.quizzapp.Riddler.service.QuizService;
import com.quizzapp.Riddler.service.ServiceImpl.UserServiceImpl;

@ExtendWith(MockitoExtension.class)
public class ControllerTests {

    @Mock
    private UserServiceImpl userServiceImpl;

    @Mock
    private QuizService quizService;

    @InjectMocks
    private AdminController adminController;

    @InjectMocks
    private TeacherController teacherController;

    @InjectMocks
    private StudentController studentController;

    private User testUser;
    private Quiz testQuiz;
    private QuizResult testQuizResult;
    private List<User> userList;
    private List<Quiz> quizList;
    private List<QuizResult> resultList;
    private List<Question> questionList;

    @BeforeEach
    void setUp() {
        // Initialize test user
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setPassword("password");
        testUser.setEmail("test@example.com");
        testUser.setRole(Role.TEACHER);
        userList = new ArrayList<>(Arrays.asList(testUser));

        // Initialize test questions
        Question question1 = new Question();
        question1.setId(1L);
        question1.setQuestionText("What is 2+2?");
        question1.setOption1("3");
        question1.setOption2("4");
        question1.setOption3("5");
        question1.setOption4("6");
        question1.setCorrectOption(2);
        
        questionList = new ArrayList<>(Arrays.asList(question1));

        // Initialize test quiz
        testQuiz = new Quiz();
        testQuiz.setId(1L);
        testQuiz.setTitle("Math Quiz");
        testQuiz.setDuration(30);
        testQuiz.setTeacher(testUser);
        testQuiz.setQuestions(questionList);
        quizList = new ArrayList<>(Arrays.asList(testQuiz));

        // Initialize test quiz result
        testQuizResult = new QuizResult();
        testQuizResult.setId(1L);
        testQuizResult.setQuiz(testQuiz);
        testQuizResult.setStudent(testUser);
        testQuizResult.setScore(100);
        testQuizResult.setSubmissionTime(LocalDateTime.now());
        testQuizResult.setAnswersAsList(Arrays.asList(2));
        resultList = new ArrayList<>(Arrays.asList(testQuizResult));
    }

    // AdminController Tests
    @Test
    void testCreateUser() {
        when(userServiceImpl.createUser(any(User.class))).thenReturn(testUser);

        ResponseEntity<User> response = adminController.createUser(testUser);
        
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1L, response.getBody().getId());
        assertEquals("testuser", response.getBody().getUsername());
        assertEquals("test@example.com", response.getBody().getEmail());
        assertEquals(Role.TEACHER, response.getBody().getRole());
        
        verify(userServiceImpl).createUser(any(User.class));
    }

    @Test
    void testGetAllUsers() {
        when(userServiceImpl.getAllUsers()).thenReturn(userList);

        ResponseEntity<List<User>> response = adminController.getAllUsers();
        
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
        assertEquals(1L, response.getBody().get(0).getId());
        assertEquals("testuser", response.getBody().get(0).getUsername());
        assertEquals("test@example.com", response.getBody().get(0).getEmail());
        assertEquals(Role.TEACHER, response.getBody().get(0).getRole());
        
        verify(userServiceImpl).getAllUsers();
    }

    @Test
    void testGetUserById() {
        when(userServiceImpl.getUserById(1L)).thenReturn(testUser);

        ResponseEntity<User> response = adminController.getUserById(1L);
        
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1L, response.getBody().getId());
        assertEquals("testuser", response.getBody().getUsername());
        assertEquals("test@example.com", response.getBody().getEmail());
        assertEquals(Role.TEACHER, response.getBody().getRole());
        
        verify(userServiceImpl).getUserById(1L);
    }

    // TeacherController Tests
    @Test
    void testCreateQuiz() {
        when(quizService.createQuiz(any(Quiz.class))).thenReturn(testQuiz);

        ResponseEntity<Quiz> response = teacherController.createQuiz(testQuiz);
        
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1L, response.getBody().getId());
        assertEquals("Math Quiz", response.getBody().getTitle());
        assertEquals(30, response.getBody().getDuration());
        assertEquals("What is 2+2?", response.getBody().getQuestions().get(0).getQuestionText());
        
        verify(quizService).createQuiz(any(Quiz.class));
    }

    @Test
    void testGetTeacherQuizzes() {
        when(quizService.getQuizzesByTeacher(1L)).thenReturn(quizList);

        ResponseEntity<List<Quiz>> response = teacherController.getTeacherQuizzes(1L);
        
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
        assertEquals(1L, response.getBody().get(0).getId());
        assertEquals("Math Quiz", response.getBody().get(0).getTitle());
        assertEquals(30, response.getBody().get(0).getDuration());
        assertEquals("What is 2+2?", response.getBody().get(0).getQuestions().get(0).getQuestionText());
        
        verify(quizService).getQuizzesByTeacher(1L);
    }

    @Test
    void testGetQuizResultsByQuizId() {
        when(quizService.getQuizResults(1L)).thenReturn(resultList);

        ResponseEntity<List<QuizResult>> response = teacherController.getQuizResults(1L);
        
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
        assertEquals(1L, response.getBody().get(0).getId());
        assertEquals(100, response.getBody().get(0).getScore());
        
        verify(quizService).getQuizResults(1L);
    }

    // StudentController Tests
    @Test
    void testSubmitQuiz() {
        List<Integer> answers = Arrays.asList(2);
        
        when(quizService.submitQuiz(1L, 1L, answers)).thenReturn(testQuizResult);

        ResponseEntity<QuizResult> response = studentController.submitQuiz(1L, 1L, answers);
        
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1L, response.getBody().getId());
        assertEquals(100, response.getBody().getScore());
        
        verify(quizService).submitQuiz(1L, 1L, answers);
    }

    @Test
    void testGetStudentResults() {
        when(quizService.getStudentResults(1L)).thenReturn(resultList);

        ResponseEntity<List<QuizResult>> response = studentController.getStudentResults(1L);
        
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
        assertEquals(1L, response.getBody().get(0).getId());
        assertEquals(100, response.getBody().get(0).getScore());
        
        verify(quizService).getStudentResults(1L);
    }

    @Test
    void testGetStudentQuizResult() {
        when(quizService.getStudentQuizResult(1L, 1L)).thenReturn(testQuizResult);

        ResponseEntity<QuizResult> response = studentController.getStudentQuizResult(1L, 1L);
        
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1L, response.getBody().getId());
        assertEquals(100, response.getBody().getScore());
        
        verify(quizService).getStudentQuizResult(1L, 1L);
    }
}