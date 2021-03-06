package com.example.springbootcrud.config;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;


@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(securedEnabled = true)
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    private UserDetailsService userService;
    private LoginSuccessHandler loginSuccessHandler;

    @Autowired
    public void setUserService(@Qualifier("serviceDetail") UserDetailsService userService) {
        this.userService = userService;
    }

    @Autowired
    public void setLoginSuccessHandler(LoginSuccessHandler loginSuccessHandler) {
        this.loginSuccessHandler = loginSuccessHandler;
    }

    @Autowired
    public void configureGlobalSecurity(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userService).passwordEncoder(passwordEncoder());
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.formLogin()
                // ?????????????????? ???????????????? ?? ???????????? ????????????
                .loginPage("/login")
                //?????????????????? ???????????? ?????????????????? ?????? ????????????
                .successHandler(new LoginSuccessHandler())
                // ?????????????????? action ?? ?????????? ????????????
                .loginProcessingUrl("/login")
                // ?????????????????? ?????????????????? ???????????? ?? ???????????? ?? ?????????? ????????????
                .usernameParameter("j_username")
                .passwordParameter("j_password")
                // ???????? ???????????? ?? ?????????? ???????????? ????????
                .permitAll();

        http.logout()
                // ?????????????????? ???????????? ???????????? ????????
                .permitAll()
                // ?????????????????? URL ??????????????
                .logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
                // ?????????????????? URL ?????? ?????????????? ??????????????
                .logoutSuccessUrl("/login?logout")
                //???????????????? ?????????????????????????? ?????????????????????? (???? ?????????? ???????????????? ??????????????)
                .and().csrf().disable();

        http
                // ???????????? ???????????????? ?????????????????????? ?????????????????????? ?????? ???????????????????????????????? ??????????????????????????
                .authorizeRequests()
                //???????????????? ?????????????????????????? ???????????????? ????????
                .antMatchers("/login").anonymous()
                // ???????????????????? URL
                .antMatchers("/admin/**").hasRole("ADMIN")
                .antMatchers("/user/**").hasAnyRole("USER","ADMIN")
                .antMatchers("/hello").access("hasAnyRole('ADMIN')").anyRequest().authenticated();

}

    @Bean
    public PasswordEncoder passwordEncoder() {
        return NoOpPasswordEncoder.getInstance();
    }


    @Bean
    public DaoAuthenticationProvider daoAuthenticationProvider() {
        DaoAuthenticationProvider daoAuthenticationProvider = new DaoAuthenticationProvider();
        daoAuthenticationProvider.setPasswordEncoder(passwordEncoder());
        daoAuthenticationProvider.setUserDetailsService(userService);
        return daoAuthenticationProvider;
    }

}
