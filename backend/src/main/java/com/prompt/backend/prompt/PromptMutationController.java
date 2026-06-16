package com.prompt.backend.prompt;

import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.stereotype.Controller;

@Controller
public class PromptMutationController {

    private final PromptService promptService;

    public PromptMutationController(PromptService promptService) {
        this.promptService = promptService;
    }

    @MutationMapping
    public PromptVersion createPromptVersion(
            @Argument Long promptId,
            @Argument CreatePromptVersionInput input
    ) {
        return promptService.createPromptVersion(
                promptId,
                input.getTemplate()
        );
    }

    @MutationMapping
    public PromptVersion promotePromptVersion(
            @Argument Long promptVersionId
    ) {
        return promptService.promotePromptVersion(promptVersionId);
    }

    @MutationMapping
    public PromptRun runPrompt(
            @Argument Long promptVersionId,
            @Argument runPromptInput.RunPromptInput input
    ) {
        return promptService.runPrompt(
                promptVersionId,
                input.input()
        );
    }
}