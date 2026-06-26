// Importa função de validação de senha
import { isPasswordValid } from './password';

// Grupo de testes de senha
describe('Password Utility', () => {
  // Teste 1: BUG — senha de 8 caracteres é válida!
  it('deve aceitar senha de 8 caracteres', () => {
    expect(isPasswordValid('Abc@1234')).toBe(true);
  });

  // Teste 2: Rejeita senha sem caractere especial (regressão)
  it('deve rejeitar senha sem caractere especial', () => {
    expect(isPasswordValid('Abc123456')).toBe(false);
  });
});
