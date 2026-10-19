package com.tarnai.duelovky.mmr.repositories;

import com.tarnai.duelovky.mmr.dto.LeaderboardEntryDto;
import com.tarnai.duelovky.mmr.entity.Mmr;
import com.tarnai.duelovky.mmr.entity.MmrId;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MmrRepository extends JpaRepository<Mmr, MmrId> {

    @Query("""
            SELECT new com.tarnai.duelovky.mmr.dto.LeaderboardEntryDto(a.username, SUM(m.mmr))
            FROM player_mmrs m
            JOIN m.user p
            JOIN p.account a
            GROUP BY p.id, a.username
            ORDER BY SUM(m.mmr) DESC
            """)
    List<LeaderboardEntryDto> findOverallLeaderboard(Pageable pageable);

    @Query("""
            SELECT new com.tarnai.duelovky.mmr.dto.LeaderboardEntryDto(a.username, m.mmr)
            FROM player_mmrs m
            JOIN m.user p
            JOIN p.account a
            WHERE m.game.gameId = :gameId
            ORDER BY m.mmr DESC
            """)
    List<LeaderboardEntryDto> findLeaderboardByGame(@Param("gameId") Long gameId, Pageable pageable);
}
