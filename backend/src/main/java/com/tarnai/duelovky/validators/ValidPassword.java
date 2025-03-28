package com.tarnai.duelovky.validators;

import com.tarnai.duelovky.validators.PasswordValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Constraint(validatedBy = PasswordValidator.class)
@Target({ ElementType.FIELD, ElementType.PARAMETER })
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidPassword {

    String message() default "Heslo musí obsahovat alespoň 8 znaků, jedno písmeno a jednu číslici";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
