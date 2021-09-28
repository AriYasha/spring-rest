package com.example.springbootcrud.controller;
import com.example.springbootcrud.model.Role;
import com.example.springbootcrud.model.User;
import com.example.springbootcrud.service.RoleService;
import com.example.springbootcrud.service.UserService;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Controller
public class UsersController {

    private UserService userService;

    private RoleService roleService;

    @Autowired
    public UsersController(UserService userService, RoleService roleService) {
        this.roleService = roleService;
        this.userService = userService;
    }

    @GetMapping(value = "admin")
    public String printWelcome(ModelMap model) {
        List<User> userList = userService.getAllUsers();
        model.addAttribute("userList", userList);
        Set<Role> roleList = roleService.getAllRoles();
        model.addAttribute("roles", roleList);
        return "index";
    }

    @GetMapping(value = "admin/createUserAddForm")
    public String createAddUserForm(User user, Model model) {
        Set<Role> roleList = roleService.getAllRoles();
        model.addAttribute("roles", roleList);
        return "createUserAddForm";
    }

    @GetMapping(value = "user")
    public String printWelcome(ModelMap model, Principal principal) {
        List<User> userList = new ArrayList<>();
        userList.add(userService.getUserByName(principal.getName()));
        model.addAttribute("userList", userList);
        return "index";
    }

    @PostMapping(value = "/userCreate")
    public String createUser(@Validated User user,
                             BindingResult bindingResult ) {
        Set<Role> roles = user.getRoles();
        Set<Role> roleList = roleService.getAllRoles();
        roleList.retainAll(roles);
        user.setRolesFromSet(roleList);
        userService.saveUser(user);
        return "redirect:/admin";
    }

    @GetMapping(value = "delete-user")
    @JsonIgnore
    public String deleteUser(User user, BindingResult bindingResult) {
      userService.deleteUserById(user.getId());
        return "redirect:/admin";
    }

    @GetMapping(value = "admin/updateUser/{id}")
    @ResponseBody
    public User updateUser(@PathVariable("id") Long id, Model model) {
        User user = userService.getUserById(id);
        Set<Role> roles = roleService.getAllRoles();
        return user;
    }

    @GetMapping(value = "admin/delete/{id}")
    @ResponseBody
    @JsonIgnore
    public User deleteUser(@PathVariable("id") Long id, Model model) {
        User user = userService.getUserById(id);
        return user;
    }

    @PostMapping(value = "/user-update")
    public String updateUserForm(User user, BindingResult bindingResult) {
        Set<Role> roles = user.getRoles();
        Set<Role> roleList = roleService.getAllRoles();
        roleList.retainAll(roles);
        userService.updateUser(user);
        return "redirect:/admin";
    }

    @RequestMapping(value = "login", method = RequestMethod.GET)
    public String loginPage() {
        return "login";
    }
}