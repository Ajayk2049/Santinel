package com.sentinel.controllers;

import com.sentinel.models.User;
import com.sentinel.models.Workspace;
import com.sentinel.repositories.UserRepository;
import com.sentinel.repositories.WorkspaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/workspaces")
@RequiredArgsConstructor
public class WorkspaceController {
    private final WorkspaceRepository workspaceRepository;
    private final UserRepository userRepository;

    private String getCurrentUserId() {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findByEmail(email).map(User::getId).orElse(null);
    }

    @PostMapping
    public Workspace createWorkspace(@RequestBody Workspace workspace) {
        String userId = getCurrentUserId();
        workspace.setUserId(userId);
        return workspaceRepository.save(workspace);
    }

    @GetMapping
    public List<Workspace> getWorkspaces() {
        String userId = getCurrentUserId();
        return workspaceRepository.findByUserId(userId);
    }
}
