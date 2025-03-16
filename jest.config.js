module.exports = {
    // Diretórios onde os testes estão localizados
    testMatch: ["**/tests/**/*.test.js"],
  
    // Pastas a serem ignoradas
    testPathIgnorePatterns: ["/node_modules/"],
  
    // Cobertura de código
    collectCoverage: true,
    coverageDirectory: "coverage", // Pasta onde o relatório de cobertura será gerado
    coverageReporters: ["text", "lcov"], // Formatos de relatório
  
    // Configurações para testes assíncronos
    testEnvironment: "node", // Ambiente de teste (Node.js)
  
    // Mapeamento de módulos (opcional, útil para testes com módulos ES6)
    moduleNameMapper: {
      "^@/(.*)$": "<rootDir>/src/$1", // Exemplo de alias para imports
    },
  };