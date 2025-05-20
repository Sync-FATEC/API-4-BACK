Feature: Processamento de dados recebidos via JSON

    Scenario: Cadastro de medidas com sucesso
        Given que a estação esta com parametros cadastrados
        When o sistema receber os dados de medidas
        Then o sistema deve cadastrar todos os dados
    
    Scenario: Ignorar dados recebidos quando parâmetros da estação estão ausentes
        Given que a estação nao tem o parametros cadastrados
        When o sistema receber os dados de medidas
        Then o sistema deve ignorar os dados recebidos