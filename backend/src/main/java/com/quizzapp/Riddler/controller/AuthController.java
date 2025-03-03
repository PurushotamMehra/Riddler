package com.quizzapp.Riddler.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.quizzapp.Riddler.dto.LoginDTO;
import com.quizzapp.Riddler.dto.JwtResponse;
import com.quizzapp.Riddler.model.User;
// import com.quizzapp.Riddler.security.JwtUtils;
import com.quizzapp.Riddler.service.UserService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    // @Autowired
    // private JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(@RequestBody LoginDTO loginDTO) {
        User user = userService.login(loginDTO.getUsername(), loginDTO.getPassword());
        // String token = jwtUtils.generateToken(user);
        String token = "dummy-token";

        return ResponseEntity.ok(new JwtResponse(token, user.getUsername(), user.getRole().name()));
    }
}
