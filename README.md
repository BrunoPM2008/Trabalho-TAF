**Projeto acadêmico** desenvolvido para a disciplina de **Programação para Engenharia** do curso de engenharia de software.

O projeto consiste em um sistema web completo (Full-Stack) para gerenciar, calcular e classificar o desempenho de soldados no **Teste de Aptidão Física (TAF)**, utilizando como referência os critérios reais de pontuação e suficiência do Exército Brasileiro.

---

O projeto foi construído dividindo as responsabilidades entre um backend e um frontend:

* **Backend:** 
    * **Flask:** Construção da API RESTful
* **Frontend:**
    * **HTML5 & CSS3:** Interface customizada utilizando a identidade visual e o padrão estético do Exército Brasileiro.
    * **JavaScript (Vanilla):** Consumo assíncrono da API via `fetch` para listagem, ordenação dinâmica (pódio) e manipulação do DOM em tempo real.

---

O sistema automatiza a avaliação dos soldados em 4 modalidades principais, convertendo os índices brutos em pontuações de desempenho:

1.  **Corrida (12 minutos):** Métrica calculada com base na distância percorrida em metros.
2.  **Flexão de Braços:** Avaliação da resistência dos membros superiores.
3.  **Abdominais:** Teste de resistência da região core (em 1 minuto).
4.  **Barra Fixa:** Teste de força estrita (pegada em pronação).

O sistema processa os dados enviados pelo frontend, aplica as condicionais de aptidão/pontuação e devolve uma lista ordenada dos soldados com maior pontuação (ranking/pódio).

---

Antes de começar, você vai precisar ter instalado em sua máquina o [Python 3.14.5](https://www.python.org/downloads/).
E instale o Flask (caso ainda não tenha instalado):
```bash
pip install flask
```
1. Clonar o Repositório
```bash
git clone https://github.com/BrunoPM2008/Trabalho-TAF.git
cd Trabalho-TAF
```
2. Rodar o projeto
```bash
source .venv/bin/activate.fish
python app.py
```