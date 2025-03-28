package com.tarnai.duelovky.users.dto;

import com.tarnai.duelovky.validators.ValidPassword;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterDto {
    @NotBlank(message = "Email nesmí být prázdný")
    @Email(message = "Neplatná emailová adresa")
    private String email;
    @NotBlank(message = "Uživatelské jméno nesmí být prázdné")
    private String username;
    @ValidPassword
    private String password;
}
