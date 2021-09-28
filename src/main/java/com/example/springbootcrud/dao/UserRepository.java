package com.example.springbootcrud.dao;

import com.example.springbootcrud.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String name);
}