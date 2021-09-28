package com.example.springbootcrud.controller;


import com.example.springbootcrud.model.Role;
import com.example.springbootcrud.model.User;
import com.example.springbootcrud.service.RoleService;
import com.example.springbootcrud.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Set;

@org.springframework.web.bind.annotation.RestController
@RequestMapping("/admin")
public class RestAdminController {

    private UserService userService;

    private RoleService roleService;

    @Autowired
    public RestAdminController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @GetMapping("/users")
    public List<User> getAllUsers(){
        System.out.println(userService.getAllUsers());
        return userService.getAllUsers();
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
         User user = userService.getUserById(id);
        System.out.println(user.toString()+ "result");
        return new ResponseEntity<>(user, HttpStatus.OK);
    }


    @PostMapping("/users")
    public void addNewUser (@RequestBody User user) {
         userService.saveUser(user);
    }

    @PutMapping("/users/{id}")
    public void updateUser(@RequestBody User user) {
        Set<Role> roles = user.getRoles();
        Set<Role> roleList = roleService.getAllRoles();
        roleList.retainAll(roles);
        user.setRolesFromSet(roleList);
        userService.updateUser(user);
    }

    @DeleteMapping("/users/{id}")
    public void deleteUser(@PathVariable Long id) throws Exception {
        User user = userService.getUserById(id);
        if (user == null) {
            throw new Exception("There is no such user in database");
        }
        userService.deleteUserById(id);
    }
}
