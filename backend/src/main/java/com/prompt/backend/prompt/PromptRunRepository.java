package com.prompt.backend.prompt;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PromptRunRepository extends JpaRepository<PromptRun, Long> {

    List<PromptRun> findByPromptVersionIdOrderByCreatedAtDesc(Long promptVersionId);
}