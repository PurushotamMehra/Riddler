package com.quizzapp.Riddler.service;

import com.quizzapp.Riddler.model.User;

import java.util.List;

public interface UserService {

    User createUser(User user);

    User updateUser(Long id, User user);

    void deleteUser(Long id);

    User getUserById(Long id);

    List<User> getAllUsers();

    User login(String username, String password);
}
