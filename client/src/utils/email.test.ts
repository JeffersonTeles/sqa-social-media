// Importa funções de validação de email
import { isEmailValid, getEmailValidationMessage } from './email';

// Grupo de testes de email
describe('Email Utility', () => {
  // Teste 1: Aceita email válido
  it('deve aceitar email válido', () => {
    expect(isEmailValid('usuario@teste.com')).toBe(true);
  });

  // Teste 2: Erro para email vazio
  it('deve dar erro email vazio', () => {
    expect(getEmailValidationMessage('')).toBe('Email é obrigatório');
  });
});
