package com.prompt.backend.prompt;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class runPromptInput {
    private String input;

    public record RunPromptInput(String input) {
    }
}


