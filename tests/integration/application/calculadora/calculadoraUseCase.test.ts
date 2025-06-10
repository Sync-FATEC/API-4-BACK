import { defineFeature, loadFeature } from "jest-cucumber";
import SetupIntegration, { getDataSource } from "../../config/setup/SetupIntegration";
import { clearDatabase } from "../../config/setup/DatabaseCleaner";
import { DataSource } from "typeorm";
import { SomarUseCase } from "../../../../src/application/use-cases/Calculadora/SomarUseCase";
import { SubtrairUseCase } from "../../../../src/application/use-cases/Calculadora/SubtrairUseCase";
import { VezesUseCase } from "../../../../src/application/use-cases/Calculadora/VezesUseCase";
import { DividirUseCase } from "../../../../src/application/use-cases/Calculadora/DividirUseCase";

const feature = loadFeature('./tests/integration/application/calculadora/calculadora.feature')
let dataSource: DataSource;

defineFeature(feature, (test) => {
    beforeAll(async () => {
        await SetupIntegration();
        dataSource = getDataSource();
    });

    beforeEach(async () => {
        await clearDatabase(dataSource);
    });
    
    afterAll(async () => {
        await dataSource.destroy(); 
    });

    // SOMA
    test('somar dois numeros positivos', ({ given, when, then }) => {
        let numero1: number;
        let numero2: number;
        let resultado: number;
        let somarUseCase: SomarUseCase;
        
        given('que sao dois numeros positivos', () => {
            numero1 = 10;
            numero2 = 5;
            somarUseCase = new SomarUseCase();
        });

        when('o sistema receber os numeros', () => {
            resultado = somarUseCase.execute(numero1, numero2);
        });

        then('o sistema deve somar os dois numeros corretamente', () => {
            expect(resultado).toBe(15);
        });
    });

    test('somar numero positivo com numero negativo', ({ given, when, then }) => {
        let numero1: number;
        let numero2: number;
        let resultado: number;
        let somarUseCase: SomarUseCase;
        
        given('que um numero é positivo e o outro negativo', () => {
            numero1 = 10;
            numero2 = -5;
            somarUseCase = new SomarUseCase();
        });

        when('o sistema receber os numeros', () => {
            resultado = somarUseCase.execute(numero1, numero2);
        });

        then('o sistema deve somar os dois e retornar o resultado correto', () => {
            expect(resultado).toBe(5);
        });
    });

    test('somar dois numeros negativos', ({ given, when, then }) => {
        let numero1: number;
        let numero2: number;
        let resultado: number;
        let somarUseCase: SomarUseCase;
        
        given('que sao dois numeros negativos', () => {
            numero1 = -10;
            numero2 = -5;
            somarUseCase = new SomarUseCase();
        });

        when('o sistema receber os numeros', () => {
            resultado = somarUseCase.execute(numero1, numero2);
        });

        then('o sistema deve somar e retornar o valor negativo correspondente', () => {
            expect(resultado).toBe(-15);
        });
    });

    // SUBTRAÇÃO
    test('subtrair dois numeros positivos', ({ given, when, then }) => {
        let numero1: number;
        let numero2: number;
        let resultado: number;
        let subtrairUseCase: SubtrairUseCase;
        
        given('que sao dois numeros positivos', () => {
            numero1 = 10;
            numero2 = 5;
            subtrairUseCase = new SubtrairUseCase();
        });

        when('o sistema receber os numeros', () => {
            resultado = subtrairUseCase.execute(numero1, numero2);
        });

        then('o sistema deve subtrair corretamente o segundo do primeiro', () => {
            expect(resultado).toBe(5);
        });
    });

    test('subtrair um numero negativo de um positivo', ({ given, when, then }) => {
        let numero1: number;
        let numero2: number;
        let resultado: number;
        let subtrairUseCase: SubtrairUseCase;
        
        given('que o primeiro numero é positivo e o segundo é negativo', () => {
            numero1 = 10;
            numero2 = -5;
            subtrairUseCase = new SubtrairUseCase();
        });

        when('o sistema receber os numeros', () => {
            resultado = subtrairUseCase.execute(numero1, numero2);
        });

        then('o sistema deve somar os valores e retornar o resultado', () => {
            expect(resultado).toBe(15);
        });
    });

    test('subtrair dois numeros negativos', ({ given, when, then }) => {
        let numero1: number;
        let numero2: number;
        let resultado: number;
        let subtrairUseCase: SubtrairUseCase;
        
        given('que sao dois numeros negativos', () => {
            numero1 = -10;
            numero2 = -5;
            subtrairUseCase = new SubtrairUseCase();
        });

        when('o sistema receber os numeros', () => {
            resultado = subtrairUseCase.execute(numero1, numero2);
        });

        then('o sistema deve subtrair corretamente considerando os sinais', () => {
            expect(resultado).toBe(-5);
        });
    });

    // MULTIPLICAÇÃO
    test('multiplicar dois numeros positivos', ({ given, when, then }) => {
        let numero1: number;
        let numero2: number;
        let resultado: number;
        let vezesUseCase: VezesUseCase;
        
        given('que sao dois numeros positivos', () => {
            numero1 = 10;
            numero2 = 5;
            vezesUseCase = new VezesUseCase();
        });

        when('o sistema receber os numeros', () => {
            resultado = vezesUseCase.execute(numero1, numero2);
        });

        then('o sistema deve multiplicar e retornar o produto positivo', () => {
            expect(resultado).toBe(50);
        });
    });

    test('multiplicar um numero positivo por um numero negativo', ({ given, when, then }) => {
        let numero1: number;
        let numero2: number;
        let resultado: number;
        let vezesUseCase: VezesUseCase;
        
        given('que um numero é positivo e o outro negativo', () => {
            numero1 = 10;
            numero2 = -5;
            vezesUseCase = new VezesUseCase();
        });

        when('o sistema receber os numeros', () => {
            resultado = vezesUseCase.execute(numero1, numero2);
        });

        then('o sistema deve retornar um produto negativo', () => {
            expect(resultado).toBe(-50);
        });
    });

    test('multiplicar dois numeros negativos', ({ given, when, then }) => {
        let numero1: number;
        let numero2: number;
        let resultado: number;
        let vezesUseCase: VezesUseCase;
        
        given('que sao dois numeros negativos', () => {
            numero1 = -10;
            numero2 = -5;
            vezesUseCase = new VezesUseCase();
        });

        when('o sistema receber os numeros', () => {
            resultado = vezesUseCase.execute(numero1, numero2);
        });

        then('o sistema deve retornar um produto positivo', () => {
            expect(resultado).toBe(50);
        });
    });

    // DIVISÃO
    test('dividir dois numeros positivos', ({ given, when, then }) => {
        let numero1: number;
        let numero2: number;
        let resultado: number;
        let dividirUseCase: DividirUseCase;
        
        given('que sao dois numeros positivos', () => {
            numero1 = 10;
            numero2 = 5;
            dividirUseCase = new DividirUseCase();
        });

        when('o sistema receber os numeros', () => {
            resultado = dividirUseCase.execute(numero1, numero2);
        });

        then('o sistema deve dividir e retornar o quociente positivo', () => {
            expect(resultado).toBe(2);
        });
    });

    test('dividir um numero positivo por um numero negativo', ({ given, when, then }) => {
        let numero1: number;
        let numero2: number;
        let resultado: number;
        let dividirUseCase: DividirUseCase;
        
        given('que um numero é positivo e o outro negativo', () => {
            numero1 = 10;
            numero2 = -5;
            dividirUseCase = new DividirUseCase();
        });

        when('o sistema receber os numeros', () => {
            resultado = dividirUseCase.execute(numero1, numero2);
        });

        then('o sistema deve retornar um quociente negativo', () => {
            expect(resultado).toBe(-2);
        });
    });

    test('dividir dois numeros negativos', ({ given, when, then }) => {
        let numero1: number;
        let numero2: number;
        let resultado: number;
        let dividirUseCase: DividirUseCase;
        
        given('que sao dois numeros negativos', () => {
            numero1 = -10;
            numero2 = -5;
            dividirUseCase = new DividirUseCase();
        });

        when('o sistema receber os numeros', () => {
            resultado = dividirUseCase.execute(numero1, numero2);
        });

        then('o sistema deve retornar um quociente positivo', () => {
            expect(resultado).toBe(2);
        });
    });

    test('tentativa de divisão por zero', ({ given, when, then }) => {
        let numero1: number;
        let numero2: number;
        let dividirUseCase: DividirUseCase;
        let erro: Error | null = null;
        
        given('que o segundo numero é zero', () => {
            numero1 = 10;
            numero2 = 0;
            dividirUseCase = new DividirUseCase();
        });

        when('o sistema tentar dividir o primeiro pelo segundo', () => {
            try {
                dividirUseCase.execute(numero1, numero2);
            } catch (error) {
                erro = error as Error;
            }
        });

        then('o sistema deve retornar um erro de divisão por zero', () => {
            expect(erro).not.toBeNull();
            expect(erro?.message).toBe("Divisão por zero não é permitida.");
        });
    });
});