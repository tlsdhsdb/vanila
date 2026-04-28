package com.vanilladream.backend.jobclass;

import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface JobClassStatRewardRepository extends JpaRepository<JobClassStatReward, Long> {

    List<JobClassStatReward> findByJobClassIdOrderByIdAsc(Long jobClassId);

    List<JobClassStatReward> findByJobClassIdInOrderByJobClassIdAscIdAsc(Collection<Long> jobClassIds);
}
