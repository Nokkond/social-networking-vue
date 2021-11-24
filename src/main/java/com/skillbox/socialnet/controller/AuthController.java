package com.skillbox.socialnet.controller;


import com.skillbox.socialnet.model.RQ.AuthUserRQ;
import com.skillbox.socialnet.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login
            (@RequestBody AuthUserRQ authUserRQ)
    {
        return ResponseEntity.ok(authService.login());
    }


    @PostMapping("/logout")
    public ResponseEntity<?> logout () {
        return ResponseEntity.ok(authService.logout());
    }

}
