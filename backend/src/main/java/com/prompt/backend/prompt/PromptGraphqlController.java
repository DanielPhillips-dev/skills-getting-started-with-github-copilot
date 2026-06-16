package com.prompt.backend.prompt;

import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
public class PromptGraphqlController {

    private final PromptService promptService;
    private final PromptRunRepository promptRunRepository;

    public PromptGraphqlController(PromptService promptService,
                                   PromptRunRepository promptRunRepository) {
        this.promptService = promptService;
        this.promptRunRepository = promptRunRepository;
    }

    @QueryMapping
    public List<Prompt> prompts() {
        return promptService.findAll();
    }

    @QueryMapping
    public Prompt prompt(@Argument Long id) {
        return promptService.findById(id);
    }

    @QueryMapping
    public List<PromptRun> promptRuns(@Argument Long promptVersionId) {
        return promptRunRepository.findByPromptVersionIdOrderByCreatedAtDesc(promptVersionId);
    }

    @MutationMapping
    public Prompt createPrompt(@Argument CreatePromptInput input) {
        Prompt created = promptService.createPrompt(input.name(), input.description());

        if (created == null) {
            throw new RuntimeException("Failed to create prompt - service returned null.");
        }

        return created;
    }

    @MutationMapping
    public Prompt updatePrompt(@Argument Long id,
                               @Argument UpdatePromptInput input) {
        return promptService.updatePrompt(
                id,
                input.name(),
                input.description()
        );
    }
}