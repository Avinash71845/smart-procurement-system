package com.hackathon_group.smart_procurement_system_backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;

    public JwtAuthFilter(JwtService jwtService, CustomUserDetailsService userDetailsService) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String mobile;

        // 1. Agar header missing hai ya Bearer se start nahi hota -> aage badha do
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 2. Token extract karo ("Bearer " ke aage ka text)
        jwt = authHeader.substring(7);

        // 3. Token se mobile number nikalo
        mobile = jwtService.extractMobile(jwt);

        // 4. Check karo: mobile mil gaya aur abhi tak user login mark nahi hua hai
        if (mobile != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            // 5. Check karo kya token valid hai
            if (jwtService.isTokenValid(jwt)) {

                // Database se user details load karo
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(mobile);

                // Spring Security ka authentication token banao
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // Context me stamp laga diya (user is now authenticated)
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        // 6. Request ko controller tak jane do
        filterChain.doFilter(request, response);
    }
}
