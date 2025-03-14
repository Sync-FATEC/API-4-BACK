<h2 id='topo'>Backend do Sistema de Monitoramento Ambiental</h2>

<div align="center">
<a href="#descricao"> Descrição </a> |
<a href="#tecnologias"> Tecnologias Utilizadas </a> |
<a href="#scripts"> Scripts Disponíveis </a> |

<a href="#execucao"> Como Executar </a> |
<a href="#estrutura"> Estrutura de Diretórios </a> |
<a href="#contribuidores"> Contribuidores </a>
</div>

<br>

<h2 id='descricao'> Descrição </h2>
Este é o backend do sistema de monitoramento ambiental desenvolvido para a Tecsus. Ele é responsável por gerenciar a lógica de negócios, autenticação e comunicação com o banco de dados.

<br>

<h2 id='tecnologias'> Tecnologias Utilizadas </h2>
<ul>
<li>Node.js</li>
<li>Express</li>
<li>TypeORM</li>
<li>MySQL</li>
<li>JWT para autenticação</li>
<li>TypeScript</li>
</ul>

<br>

<h2 id='scripts'> Scripts Disponíveis </h2>
<ul>
<li><code>dev</code>: Inicia o servidor em modo de desenvolvimento.</li>
<li><code>build</code>: Compila o código TypeScript para JavaScript.</li>
<li><code>start</code>: Inicia o servidor a partir do código compilado.</li>
<li><code>typeorm</code>: Executa comandos do TypeORM.</li>
</ul>

<br>

<h2 id='execucao'> Como Executar </h2>
<ol>
<li>Instale as dependências com <code>npm install</code>.</li>
<li>Configure as variáveis de ambiente no arquivo <code>.env</code>.</li>
<li>Execute <code>npm run dev</code> para iniciar o servidor em modo de desenvolvimento.</li>
</ol>

<br>

<h2 id='estrutura'> Estrutura de Diretórios </h2>
<ul>
<li><code>src/</code>: Contém o código fonte do backend.
  <ul>
    <li><code>web/</code>: Contém as rotas e controladores.</li>
    <li><code>infrastructure/</code>: Configurações de infraestrutura.</li>
    <li><code>application/</code>: Lógica de aplicação.</li>
    <li><code>domain/</code>: Modelos de domínio.</li>
  </ul>
</li>
</ul>

<br>

<h2 id='contribuidores'> Contribuidores </h2>
<ul>
<li>João Gabriel Solis (Scrum Master)</li>
<li>Ana Laura Moratelli (Product Owner)</li>
<li>Ana Clara Marques (Desenvolvedora)</li>
<li>Erik Yokota (Desenvolvedor)</li>
<li>Filipe Colla (Desenvolvedor)</li>
<li>Kauê Francisco (Desenvolvedor)</li>
</ul>

<a href='#topo'> Voltar ao topo </a> 