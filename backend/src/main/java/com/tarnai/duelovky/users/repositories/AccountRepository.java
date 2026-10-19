package com.tarnai.duelovky.users.repositories;

import com.tarnai.duelovky.users.entity.Account;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
    @Query("SELECT a FROM accounts a WHERE a.username LIKE CONCAT('%', :searchTerm, '%') OR a.email LIKE CONCAT('%', :searchTerm, '%')")
    List<Account> findBySearchTerm(@Param("searchTerm") String searchTerm);

    @Query("""
            SELECT a FROM accounts a
            WHERE a.id <> :currentUserId
            AND (:searchTerm = '' OR LOWER(a.username) LIKE LOWER(CONCAT('%', :searchTerm, '%')))
            AND NOT EXISTS (
                SELECT 1 FROM Friendship f
                WHERE (f.user1.id = :currentUserId AND f.user2.id = a.id)
                   OR (f.user2.id = :currentUserId AND f.user1.id = a.id)
            )
            """)
    Page<Account> searchNonFriends(
            @Param("currentUserId") Long currentUserId,
            @Param("searchTerm") String searchTerm,
            Pageable pageable);

    List<Account> findByUsername(String username);
    List<Account> findByEmail(String email);

    @Query("SELECT a FROM accounts a WHERE a.admin.id = :adminId")
    List<Account> findByAdminId(@Param("adminId") Long adminId);
}
