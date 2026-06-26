// Importa o que precisamos
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Button from './Button';

// Grupo de testes do Button
describe('Button Component', () => {
  // Teste 1: Renderiza texto do botão
  it('deve mostrar texto do botão', () => {
    render(<Button>Clique Aqui</Button>);
    expect(screen.getByText('Clique Aqui')).toBeInTheDocument();
  });

  // Teste 2: Chama onClick ao clicar
  it('deve chamar função ao clicar', () => {
    const handleClick = jest.fn(); // Função fake
    render(<Button onClick={handleClick}>Clique Aqui</Button>);
    fireEvent.click(screen.getByText('Clique Aqui')); // Simula clique
    expect(handleClick).toHaveBeenCalledTimes(1); // Verifica se foi chamada 1 vez
  });
});
