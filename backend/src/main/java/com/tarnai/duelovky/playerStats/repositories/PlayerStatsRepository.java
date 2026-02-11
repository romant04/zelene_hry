package com.tarnai.duelovky.playerStats.repositories;

import com.tarnai.duelovky.mmr.entity.MmrId;
import com.tarnai.duelovky.playerStats.entity.PlayerStats;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlayerStatsRepository extends JpaRepository<PlayerStats, MmrId> {
}
