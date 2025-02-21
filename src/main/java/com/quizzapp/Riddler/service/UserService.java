package com.quizzapp.Riddler.service;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.quizzapp.Riddler.model.User;
import com.quizzapp.Riddler.repository.UserRepo;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    @Autowired
    private UserRepo userRepo;
    
    public User createUser(User user) {
        return userRepo.save(user);
    }
    
    public User updateUser(Long id, User user) {
        User existingUser = userRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));
        return userRepo.save(existingUser);
    }
    
    public void deleteUser(Long id) {
        userRepo.deleteById(id);
    }
    
    public List<User> getAllUsers() {
        return userRepo.findAll();
    }
    
    public User login(String username, String password) {
        User user = userRepo.findByUsername(username);
        if (user != null && user.getPassword().equals(password)) {
            return user;
        }
        throw new RuntimeException("Invalid credentials");
    }
}