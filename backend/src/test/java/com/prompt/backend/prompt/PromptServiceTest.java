package com.prompt.backend.prompt;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;

import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class PromptServiceTest {

    private PromptRepository promptRepository;
    private PromptVersionRepository promptVersionRepository;
    private PromptRunRepository promptRunRepository;
    private PromptService service;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        promptRepository = mock(PromptRepository.class);
        promptVersionRepository = mock(PromptVersionRepository.class);
        promptRunRepository = mock(PromptRunRepository.class);

        service = new PromptService(promptRepository, promptVersionRepository, promptRunRepository);
    }

    @Test
    void findAllDelegatesToRepository() {
        when(promptRepository.findAll()).thenReturn(Collections.emptyList());

        var result = service.findAll();

        assertNotNull(result);
        assertEquals(0, result.size());
        verify(promptRepository).findAll();
    }

    @Test
    void findByIdThrowsWhenMissing() {
        when(promptRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> service.findById(1L));
        verify(promptRepository).findById(1L);
    }

    @Test
    void createPromptSavesAndReturns() {
        when(promptRepository.save(any(Prompt.class))).thenAnswer(inv -> {
            Prompt p = inv.getArgument(0);
            p.setId(123L);
            return p;
        });

        Prompt saved = service.createPrompt("My Prompt", "desc");

        assertEquals("My Prompt", saved.getName());
        assertEquals("desc", saved.getDescription());
        assertEquals(123L, saved.getId());
        verify(promptRepository).save(any(Prompt.class));
    }
}
