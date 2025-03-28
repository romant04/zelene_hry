package com.tarnai.duelovky.users.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginDto {
    @NotBlank(message = "Email nesmí být prázdný")
    @Email(message = "Neplatná emailová adresa")
    private String email;
    @NotBlank(message = "Heslo nesmí být prázdné")
    private String password;

    public LoginDto(String email, String password) {
        this.email = email;
        this.password = password;
    }
}
