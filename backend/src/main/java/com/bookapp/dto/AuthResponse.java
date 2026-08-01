package com.bookapp.dto;

public record AuthResponse(String token, String tokenType, UserDto user) {

    public record UserDto(Long id, String username, String email, String fullName) {}
}
