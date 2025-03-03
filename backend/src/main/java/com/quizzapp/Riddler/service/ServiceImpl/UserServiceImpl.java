package com.quizzapp.Riddler.service.ServiceImpl;

import jakarta.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.quizzapp.Riddler.model.User;
import com.quizzapp.Riddler.repository.UserRepo;
import com.quizzapp.Riddler.service.UserService;

import java.util.List;

@Service
public class UserServiceImpl implements UserService{
    @Autowired
    private UserRepo userRepo;

    public User createUser(User user) {
        if (userRepo.existsByUsername(user.getUsername())) {
            throw new IllegalArgumentException("User with username '" + user.getUsername() + "' already exists.");
        }
        if (userRepo.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("User with email '" + user.getEmail() + "' already exists.");
        }
        return userRepo.save(user);
    }

    public User updateUser(Long id, User user) {
        User existingUser = userRepo.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("User with ID " + id + " not found"));

        existingUser.setUsername(user.getUsername());
        existingUser.setPassword(user.getPassword());
        existingUser.setEmail(user.getEmail());
        existingUser.setRole(user.getRole());
        
        return userRepo.save(existingUser);
    }

    public void deleteUser(Long id) {
        if (!userRepo.existsById(id)) {
            throw new EntityNotFoundException("User with ID " + id + " not found");
        }
        userRepo.deleteById(id);
    }

    public User getUserById(Long id) {
        return userRepo.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("User with ID " + id + " not found"));
    }
    
    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    
    public User login(String username, String password) {
        User user = userRepo.findByUsername(username);
        if (user == null) {
            throw new EntityNotFoundException("User with username '" + username + "' not found");
        }
        if (!user.getPassword().equals(password)) { 
            throw new IllegalArgumentException("Incorrect password");
        }
        return user;
    }

    // public User login(String username, String password) {
    //     User user = userRepo.findByUsername(username);
    //     if (user == null) {
    //         throw new EntityNotFoundException("User with username '" + username + "' not found");
    //     }
    //     // Ignore password verification for now
    //     return user;
    // }
    
    
}
