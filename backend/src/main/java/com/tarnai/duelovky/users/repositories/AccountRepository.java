package com.tarnai.duelovky.users.repositories;

import com.tarnai.duelovky.users.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
    @Query("SELECT a FROM accounts a WHERE a.username LIKE CONCAT('%', :searchTerm, '%') OR a.email LIKE CONCAT('%', :searchTerm, '%')")
    List<Account> findBySearchTerm(@Param("searchTerm") String searchTerm);

    List<Account> findByUsername(String username);
}
