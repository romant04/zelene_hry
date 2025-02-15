package com.tarnai.duelovky.users.services;

import com.tarnai.duelovky.users.entity.Account;
import com.tarnai.duelovky.users.repositories.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    private final AccountRepository accountRepository;

    @Autowired
    public UserService(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    public List<Account> getAllUsers() {
        return accountRepository.findAll();
    }

    public List<Account> getUsersBySearchTerm(String searchTerm) {
        return accountRepository.findBySearchTerm(searchTerm);
    }
}
