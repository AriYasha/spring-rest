package com.example.springbootcrud.service;

import com.example.springbootcrud.dao.RoleRepository;
import com.example.springbootcrud.model.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

@Service
public class RoleServiceImpl implements RoleService {
    @Autowired
    RoleRepository roleRepository;

    @Override
    public Set<Role> getAllRoles() {
       return roleRepository.findAll().stream().collect(Collectors.toSet());
    }
}
