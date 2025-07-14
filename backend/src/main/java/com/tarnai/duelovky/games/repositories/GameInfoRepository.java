package com.tarnai.duelovky.games.repositories;

import com.tarnai.duelovky.games.entity.GameInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GameInfoRepository extends JpaRepository<GameInfo, Long> {
    // Additional query methods can be defined here if needed
}
