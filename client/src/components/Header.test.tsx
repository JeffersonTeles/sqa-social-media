import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from './Header';
import { useAuth } from '../contexts/AuthContext';

// Cria fakes para dependências
jest.mock('next/navigation', () => ({ useRouter() { return { push: jest.fn() }; } }));
jest.mock('../contexts/AuthContext', () => ({ useAuth: jest.fn() }));

// Grupo de testes do Header
describe('Header Component', () => {
  // Teste 1: Mostra título e botões para usuário deslogado
  it('deve mostrar titulo e botoes deslogado', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      isAuthenticated: false,
      login: jest.fn(),
      logout: jest.fn()
    });
    render(<Header />);
    expect(screen.getByText('SQA Social Media')).toBeInTheDocument();
    expect(screen.getByText('Entrar')).toBeInTheDocument();
    expect(screen.getByText('Criar Conta')).toBeInTheDocument();
  });
});
