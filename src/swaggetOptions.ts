export const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'API de Monitoramento',
        version: '1.0.0',
        description: 'API para gerenciamento de estações, parâmetros e alertas',
      },
      servers: [
        {
          url: `http://localhost:${process.env.PORT}`,
          description: 'Servidor de Desenvolvimento',
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    },
    apis: ['./src/web/routes/*.ts'], // Caminho para os arquivos de rotas
  };