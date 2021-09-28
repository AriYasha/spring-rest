package com.example.springbootcrud.service;

import com.example.springbootcrud.dao.UserRepository;
import com.example.springbootcrud.model.Role;
import com.example.springbootcrud.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

//import java.util.Collection;
//import java.util.stream.Collectors;
//
//@Service
//public class ServiceDetail implements UserDetailsService {
//    @Autowired
//    private UserRepository userRepository;
//    @Override
//   // @Transactional
//    public UserDetails loadUserByUsername(String s) throws UsernameNotFoundException {
//        User user =  userRepository.findByUsername(s);
//        if (user == null) {
//            throw new UsernameNotFoundException(String.format("User %s not found",s));
//        }
//        System.out.println(user.getRoles());
//        return new org.springframework.security.core.userdetails.User(user.getUsername(),user.getPassword(), grantedAuthorities(user.getRoles()));
//
//    }
//
//    private Collection<? extends GrantedAuthority> grantedAuthorities (Collection<Role> roles) {
//        return  roles.stream().map(role -> new SimpleGrantedAuthority(role.getAuthority())).collect(Collectors.toList());
//    }
//}
