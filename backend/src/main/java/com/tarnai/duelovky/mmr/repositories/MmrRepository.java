package com.tarnai.duelovky.mmr.repositories;

import com.tarnai.duelovky.mmr.entity.Mmr;
import com.tarnai.duelovky.mmr.entity.MmrId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MmrRepository extends JpaRepository<Mmr, MmrId> {
}
