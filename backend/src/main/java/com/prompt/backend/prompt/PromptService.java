package com.prompt.backend.prompt;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PromptService {

    private final PromptRepository promptRepository;
    private final PromptVersionRepository promptVersionRepository;
    private final PromptRunRepository promptRunRepository;

    public PromptService(
            PromptRepository promptRepository,
            PromptVersionRepository promptVersionRepository,
            PromptRunRepository promptRunRepository
    ) {
        this.promptRepository = promptRepository;
        this.promptVersionRepository = promptVersionRepository;
        this.promptRunRepository = promptRunRepository;
    }

    public List<Prompt> findAll() {
        return promptRepository.findAll();
    }

    public Prompt findById(Long id) {
        return promptRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prompt not found: " + id));
    }

    public Prompt createPrompt(String name, String description) {
        Prompt prompt = new Prompt();
        prompt.setName(name);
        prompt.setDescription(description);
        return promptRepository.save(prompt);
    }

    public Prompt updatePrompt(Long id, String name, String description) {
        Prompt prompt = findById(id);
        prompt.setName(name);
        prompt.setDescription(description);
        return promptRepository.save(prompt);
    }

        public PromptVersion createPromptVersion(Long promptId, String template) {
            Prompt prompt = findById(promptId);

            int nextVersionNumber = promptVersionRepository
                    .findTopByPromptIdOrderByVersionNumberDesc(promptId)
                    .map(latestVersion -> latestVersion.getVersionNumber() + 1)
                    .orElse(1);

            PromptVersion version = new PromptVersion();
            version.setPrompt(prompt);
            version.setTemplate(template);
            version.setVersionNumber(nextVersionNumber);
            version.setStatus(PromptVersionStatus.DRAFT);

            return promptVersionRepository.save(version);
        }


    @Transactional
    public PromptVersion promotePromptVersion(Long promptVersionId) {
        PromptVersion version = promptVersionRepository.findById(promptVersionId)
                .orElseThrow(() -> new RuntimeException("Prompt version not found: " + promptVersionId));

        Prompt prompt = version.getPrompt();

        List<PromptVersion> versions = promptVersionRepository.findByPromptId(prompt.getId());

        for (PromptVersion existingVersion : versions) {
            if (existingVersion.getId().equals(version.getId())) {
                existingVersion.setStatus(PromptVersionStatus.ACTIVE);
            } else if (existingVersion.getStatus() == PromptVersionStatus.ACTIVE) {
                existingVersion.setStatus(PromptVersionStatus.ARCHIVED);
            }
        }

        prompt.setActiveVersionId(version.getId());

        promptRepository.save(prompt);
        promptVersionRepository.saveAll(versions);

        return version;
    }

    public PromptRun runPrompt(Long promptVersionId, String input) {
        long startTime = System.currentTimeMillis();

        PromptVersion version = promptVersionRepository.findById(promptVersionId)
                .orElseThrow(() -> new RuntimeException("Prompt version not found: " + promptVersionId));

        String output = "Mock AI response\n"
                + "Version: v" + version.getVersionNumber() + "\n"
                + "Template: " + version.getTemplate() + "\n"
                + "Input: " + input + "\n"
                + "Result: This is a simulated response for testing the prompt flow.";

        int executionTime = (int) (System.currentTimeMillis() - startTime);

        PromptRun run = new PromptRun();
        run.setPromptVersion(version);
        run.setInput(input);
        run.setOutput(output);
        run.setExecutionTime(executionTime);

        return promptRunRepository.save(run);
    }

}
