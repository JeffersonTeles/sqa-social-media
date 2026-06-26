import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SignupPage from './page';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../service/auth/auth';

// Cria fakes para dependências
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({ useRouter() { return { push: mockPush }; } }));
jest.mock('../../contexts/AuthContext', () => ({ useAuth: jest.fn() }));
jest.mock('../../service/auth/auth', () => ({ authService: { signUp: jest.fn() } }));

// Grupo de testes da página de cadastro
describe('Signup Page', () => {
  // Teste 1: Erro quando senhas são diferentes
  it('deve dar erro senhas diferentes', async () => {
    const mockLogin = jest.fn();
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      isAuthenticated: false,
      login: mockLogin,
      logout: jest.fn()
    });
    
    render(<SignupPage />);
    
    // Simula usuário digitando dados
    fireEvent.change(screen.getByPlaceholderText('seu@email.com'), { target: { value: 'teste@teste.com' } });
    const passwordInputs = screen.getAllByPlaceholderText('••••••••');
    fireEvent.change(passwordInputs[0], { target: { value: 'Senha@123' } });
    fireEvent.change(passwordInputs[1], { target: { value: 'Senha@321' } }); // Senha DIFERENTE!
    
    // Clica no botão de cadastro
    const submitButton = screen.getAllByRole('button', { name: /criar conta/i })[1];
    fireEvent.click(submitButton);
    
    // Espera que apareça o erro e não chame a API
    await waitFor(() => {
      expect(screen.getByText('As senhas não coincidem')).toBeInTheDocument();
      expect(authService.signUp).not.toHaveBeenCalled();
    });
  });
});
