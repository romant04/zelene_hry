package com.tarnai.duelovky.users.dto;

import com.tarnai.duelovky.validators.ValidPassword;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterDto {
    @NotBlank(message = "Email nesmí být prázdný")
    @Email(message = "Neplatná emailová adresa")
    private String email;
    @NotBlank(message = "Uživatelské jméno nesmí být prázdné")
    @Size(min = 3, max = 20, message = "Uživatelské jméno musí být mezi 3 a 20 znaky")
    private String username;
    @ValidPassword
    private String password;
}
