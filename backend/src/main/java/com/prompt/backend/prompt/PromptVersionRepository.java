package com.prompt.backend.prompt;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PromptVersionRepository extends JpaRepository<PromptVersion, Long> {

    List<PromptVersion> findByPromptIdOrderByVersionNumberAsc(Long promptId);

    Optional<PromptVersion> findTopByPromptIdOrderByVersionNumberDesc(Long promptId);

    List<PromptVersion> findByPromptId(Long promptId);
}
