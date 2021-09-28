package com.example.springbootcrud.service;

import com.example.springbootcrud.model.User;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface UserService {
     List getAllUsers();
     User getUserById(Long id);
     void saveUser(User user);
     void updateUser(User user);
     void deleteUserById(Long id);
     User getUserByName(String name);}