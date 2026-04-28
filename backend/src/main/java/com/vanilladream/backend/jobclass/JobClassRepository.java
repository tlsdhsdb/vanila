package com.vanilladream.backend.jobclass;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.vanilladream.backend.character.JobType;

public interface JobClassRepository extends JpaRepository<JobClass, Long> {

    List<JobClass> findByJobOrderByIdAsc(JobType job);

    Optional<JobClass> findByIdAndJob(Long id, JobType job);
}
