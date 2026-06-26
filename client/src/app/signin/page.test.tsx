import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SigninPage from './page';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../service/auth/auth';

// Cria fakes para dependências
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({ useRouter() { return { push: mockPush }; } }));
jest.mock('../../contexts/AuthContext', () => ({ useAuth: jest.fn() }));
jest.mock('../../service/auth/auth', () => ({ authService: { signIn: jest.fn() } }));

// Grupo de testes da página de login
describe('Signin Page', () => {
  // Teste 1: Login com sucesso
  it('deve logar e redirecionar', async () => {
    const mockLogin = jest.fn();
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      isAuthenticated: false,
      login: mockLogin,
      logout: jest.fn()
    });
    (authService.signIn as jest.Mock).mockResolvedValue({ id: 1, email: 'teste@teste.com' });
    
    render(<SigninPage />);
    
    // Simula usuário digitando email e senha
    fireEvent.change(screen.getByPlaceholderText('seu@email.com'), { target: { value: 'teste@teste.com' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'Senha@123' } });
    
    // Clica no botão de login
    const submitButton = screen.getAllByRole('button', { name: /entrar/i })[1];
    fireEvent.click(submitButton);
    
    // Espera que aconteça tudo certo
    await waitFor(() => {
      expect(authService.signIn).toHaveBeenCalledWith({ email: 'teste@teste.com', password: 'Senha@123' });
      expect(mockLogin).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });
});
