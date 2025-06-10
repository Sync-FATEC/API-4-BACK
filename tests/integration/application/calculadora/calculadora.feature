Feature: Processamento de valores recebidos na calculadora

    Scenario: somar dois numeros positivos
        Given que sao dois numeros positivos
        When o sistema receber os numeros
        Then o sistema deve somar os dois numeros corretamente

    Scenario: somar numero positivo com numero negativo
        Given que um numero é positivo e o outro negativo
        When o sistema receber os numeros
        Then o sistema deve somar os dois e retornar o resultado correto

    Scenario: somar dois numeros negativos
        Given que sao dois numeros negativos
        When o sistema receber os numeros
        Then o sistema deve somar e retornar o valor negativo correspondente

    Scenario: subtrair dois numeros positivos
        Given que sao dois numeros positivos
        When o sistema receber os numeros
        Then o sistema deve subtrair corretamente o segundo do primeiro

    Scenario: subtrair um numero negativo de um positivo
        Given que o primeiro numero é positivo e o segundo é negativo
        When o sistema receber os numeros
        Then o sistema deve somar os valores e retornar o resultado

    Scenario: subtrair dois numeros negativos
        Given que sao dois numeros negativos
        When o sistema receber os numeros
        Then o sistema deve subtrair corretamente considerando os sinais

    Scenario: multiplicar dois numeros positivos
        Given que sao dois numeros positivos
        When o sistema receber os numeros
        Then o sistema deve multiplicar e retornar o produto positivo

    Scenario: multiplicar um numero positivo por um numero negativo
        Given que um numero é positivo e o outro negativo
        When o sistema receber os numeros
        Then o sistema deve retornar um produto negativo

    Scenario: multiplicar dois numeros negativos
        Given que sao dois numeros negativos
        When o sistema receber os numeros
        Then o sistema deve retornar um produto positivo

    Scenario: dividir dois numeros positivos
        Given que sao dois numeros positivos
        When o sistema receber os numeros
        Then o sistema deve dividir e retornar o quociente positivo

    Scenario: dividir um numero positivo por um numero negativo
        Given que um numero é positivo e o outro negativo
        When o sistema receber os numeros
        Then o sistema deve retornar um quociente negativo

    Scenario: dividir dois numeros negativos
        Given que sao dois numeros negativos
        When o sistema receber os numeros
        Then o sistema deve retornar um quociente positivo

    Scenario: tentativa de divisão por zero
        Given que o segundo numero é zero
        When o sistema tentar dividir o primeiro pelo segundo
        Then o sistema deve retornar um erro de divisão por zero
