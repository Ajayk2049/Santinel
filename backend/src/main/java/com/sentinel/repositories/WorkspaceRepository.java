package com.sentinel.repositories;

import com.sentinel.models.Workspace;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface WorkspaceRepository extends MongoRepository<Workspace, String> {
    List<Workspace> findByUserId(String userId);
}
