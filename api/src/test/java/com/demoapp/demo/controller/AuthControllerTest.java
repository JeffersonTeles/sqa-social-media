package com.demoapp.demo.controller;

// Importa o que precisamos para testar
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import com.demoapp.demo.service.UserService;
import com.demoapp.demo.model.User;

// Testa só a AuthController (rápido!)
@WebMvcTest(AuthController.class)
public class AuthControllerTest {

    // MockMvc = simula requisições HTTP
    @Autowired
    private MockMvc mockMvc;

    // UserService FAKE (não usa banco)
    @MockBean
    private UserService userService;

    // Teste 1: Cadastro FUNCIONANDO (regressão)
    @Test
    public void deveCadastrarUsuarioComSucesso() throws Exception {
        // Configura fake: tudo válido, email não existe
        when(userService.isEmailValid(anyString())).thenReturn(true);
        when(userService.isPasswordValid(anyString())).thenReturn(true);
        when(userService.findByEmail(anyString())).thenReturn(null);

        // Cria usuário fake
        User mockUser = new User();
        mockUser.setId(1L);
        mockUser.setEmail("test@test.com");
        when(userService.createUser(anyString(), anyString())).thenReturn(mockUser);

        // Dados da requisição JSON
        String jsonBody = "{\"email\":\"test@test.com\", \"password\":\"Pass@123\"}";

        // Simula requisição e verifica resultado
        mockMvc.perform(post("/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonBody))
                .andExpect(status().isOk()) // Status 200 OK
                .andExpect(jsonPath("$.email").value("test@test.com")); // Email correto
    }

    // Teste 2: Login FUNCIONANDO (regressão)
    @Test
    public void deveFazerLoginComSucesso() throws Exception {
        // Configura fake: tudo válido, usuário existe
        when(userService.isEmailValid(anyString())).thenReturn(true);
        when(userService.isPasswordValid(anyString())).thenReturn(true);

        User mockUser = new User();
        mockUser.setId(1L);
        mockUser.setEmail("test@test.com");
        mockUser.setPassword("Pass@123");
        when(userService.findByEmail(anyString())).thenReturn(mockUser);

        String jsonBody = "{\"email\":\"test@test.com\", \"password\":\"Pass@123\"}";

        mockMvc.perform(post("/auth/signin")
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("test@test.com"));
    }

    // Teste 3: BUG DA MENSAGEM DE EMAIL (FALHA DE PROPÓSITO!)
    @Test
    public void deveRetornarErroDeEmailJaCadastrado() throws Exception {
        // Configura fake: email já existe
        when(userService.isEmailValid(anyString())).thenReturn(true);
        when(userService.isPasswordValid(anyString())).thenReturn(true);
        User mockUser = new User();
        when(userService.findByEmail("existente@test.com")).thenReturn(mockUser);

        String jsonBody = "{\"email\":\"existente@test.com\", \"password\":\"Pass@123\"}";

        // ESPERA "E-mail já cadastrado" — código retorna outra coisa!
        mockMvc.perform(post("/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonBody))
                .andExpect(status().isConflict()) // Status 409 (conflito)
                .andExpect(jsonPath("$.message").value("E-mail já cadastrado"));
    }
}
