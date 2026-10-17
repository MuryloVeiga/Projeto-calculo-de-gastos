# App de Finanças — contexto para continuar em outro chat

> Resumo de tudo que foi feito até 16/10/2026 (madrugada). Leia isto antes de mexer no app.

## O que é
App pessoal de finanças do Murylo, feito como **PWA** (página web que vira app no iPhone):
- Abre no Safari e é instalado na **Tela de Início** (Compartilhar → Adicionar à Tela de Início).
- Funciona **offline**. Os **dados ficam só no aparelho** (localStorage do Safari, chave `financas.v1`), nunca no GitHub.
- Tudo é em português (pt-BR), em reais (R$).

**Link:** https://muryloveiga.github.io/Projeto-calculo-de-gastos/
**Repositório:** `MuryloVeiga/Projeto-calculo-de-gastos` (público; só tem código, nenhum dado pessoal)

## Arquivos (pasta `D:\New Project\financas`)
| Arquivo | O que é |
|---|---|
| `index.html` | O app inteiro (HTML + CSS + JS num arquivo só) |
| `sw.js` | Service worker (offline + atualização). **`VERSION`** aparece em Ajustes |
| `manifest.webmanifest` | Nome, cores e ícones do app instalado |
| `icon-180/192/512.png` | Ícone (17/10): pato em traço amarelo de óculos, fundo preto liso; fonte `arte/icone-duck-linha.webp`, desenho a 87% e dentro do círculo seguro de 40% (Android) |
| `pato8-andar/fugir/pegar.webp`, `pato8-nota.webp` | Pato de 8 direções visto de cima (andar 16 quadros, fugir com nota 12, pegar nota 15) e a nota. Feitos de `Documents\Codex6-10-16\...\outputs\pato-oito-direcoes` (quadros de 256 reduzidos para 128) |
| `pato-frente.webp` | Poses de frente ao falar (`pato-andar.webp` antigo não é mais usado) |
| `arte/` | Artes originais do pato e do ícone (fontes dos .webp) |
| `.gitignore` | Bloqueia `*.json` e `*.csv` (backups com dados pessoais) |
| `README.md` | Descrição curta + link |

Backup dos dados do PC (16/10): `D:\Users\Desktop\financas-backup-2026-10-16.json`.

## Regras de trabalho (importante)
- **Não fazer commit nem publicar sem o Murylo pedir** ("pode commitar", "publica").
- Para publicar: aumentar `VERSION` em `sw.js` no formato **2.x** (última publicada: 2.8; **2.9** já está no `sw.js`, commitada e não publicada; depois: **2.10**), `git add`, commit, `git push`.
  - Commits com e-mail privado: `336343421+MuryloVeiga@users.noreply.github.com` (já configurado no repositório local).
  - No PowerShell, **não usar aspas duplas** dentro da mensagem do commit (quebra o comando).
  - Depois do push, esperar o GitHub Pages publicar (`gh api repos/MuryloVeiga/Projeto-calculo-de-gastos/pages/builds/latest`).
- No iPhone ele atualiza em **Ajustes → 🔄 Buscar atualização** (ou abrindo o app com internet).
- **Testar no navegador do PC:** servidor `python -m http.server 5188 --directory "D:\New Project\financas"`
  (havia um `launch.json` em `D:\New Project\game\.claude\launch.json` com o nome `financas` para o painel do navegador).
  - O Murylo usa esse mesmo navegador com dados reais: **antes de testes que mudam dados, guardar `financas.v1` e restaurar depois**.
  - Antes de testar código novo: desregistrar o service worker e limpar caches, senão aparece versão velha.
- Responder e escrever textos do app em português.

## Gosto do dono (visual)
- Tema **preto e dourado** ("cartão black") como padrão; **modo claro** opcional em Ajustes.
- **Verde só nas receitas** (o que vai receber). Saldos, sobra e acumulado na cor normal; **vermelho só quando negativo**.
- Saldo em conta é o número principal do Resumo.
- Não gosta de muitos botões na tela; prefere opções em Ajustes.

## Funcionalidades (como está hoje)
### Abas (barra de baixo)
**Resumo · Lançamentos · Previsão · Investir · Ajustes**

### Resumo
- **Saldo em conta** (grande): receitas − despesas **pagas** − aplicações (+ resgates), acumulado desde o início.
- Quadrinhos: Receitas, Despesas, Saldo do mês (receitas − despesas − aplicações), Acumulado (conta + investimentos).
- "Falta pagar R$ X · depois de pagar tudo: R$ Y".
- **Contas do mês**: checkbox pago/não pago em cada despesa. Despesas vinculadas a cartão viram um item **"Fatura do cartão"**, que abre para mostrar os itens (sem checkbox) e tem o link para informar o valor da fatura. Marcar a fatura paga tudo.
- **⛽ Abastecimento**: botão "+ Abastecer" (valor, data, posto). Sempre no débito, já entra pago.
- Despesas por categoria e gráfico dos últimos 6 meses.

### Lançamentos
- Lista do mês agrupada por dia, busca e filtro (Todos/Despesas/Receitas). Tocar edita.
- Botão **+** abre o formulário: Despesa/Receita, valor, descrição, categoria, **💳 Vinculado ao cartão**, **📌 Gasto fixo** (com "Por quantos meses?" **ou** "Termina em" mês/ano, os dois ligados) e data.
- Janelas fecham pelo **✕** ou **arrastando para baixo**.

### Regras de pagamento
- Gasto **fixo** e **fatura**: começam "não pago" no mês atual/futuro; meses passados contam como pagos.
- **Gasto avulso no débito** (sem cartão, não fixo) com data até hoje: **já vem marcado como pago** (pode desmarcar). Data futura fica a pagar até chegar o dia.

### Gastos fixos (regras)
- Guardados em `S.fixed` como regras que geram um lançamento por mês (`start`, `end` = último mês ou null, `n` parcelas, `k0`, `skip`, `pay`).
- Editar um mês muda **daquele mês em diante** (divide a regra). "Excluir só este mês" e "Excluir este e os próximos".

### Cartões e fatura
- Cartões em Ajustes. Despesa vinculada entra na fatura; o valor da fatura (se informado) menos os vinculados vira "Outros gastos no cartão".

### Previsão
- **Gráfico de linha arrastável** (12 meses a partir do atual): cada ponto mostra quanto **vai sobrar** no mês.
- Arrastar para o lado seleciona o mês do centro (com encaixe); tocar na bolinha/mês também. Arrastar o extrato de baixo troca de mês.
- Embaixo: **+ vai receber, − vai pagar, = vai sobrar**, saldo em conta no fim do mês, e o extrato (entradas, saídas e faturas com itens).

### Investir
- Investimentos em `S.inv` (eventos: `set` saldo conferido, `in` aplicação, `out` resgate).
- Rende **juros compostos só em dias úteis** (sem fins de semana e feriados nacionais, inclusive Carnaval, Sexta-feira Santa e Corpus Christi).
- **CDI automático** pela API do Banco Central (série 4389), no máximo a cada 12 h; dá para fixar manualmente.
- **IR regressivo** descontado (22,5% até 180 dias, 20% até 360, 17,5% até 720, 15% depois), como o extrato do Mercado Pago (que já mostra líquido).
- Rendimento em **centavos inteiros com fração guardada** (0,41 / 0,42 como no banco).
- Calibração: "quanto rendeu no último dia útil" (aceita 0,415) e recalibração automática ao "Atualizar saldo" (5+ dias úteis sem aplicação no meio). A taxa calibrada acompanha mudanças do CDI (`effCdi`).
- Data de início ("Começou em") com valor inicial opcional (senão estima de trás para frente).
- Mostra: saldo, por dia útil, rendeu no mês, desde a data de início, previsão do fim do mês, 6 meses e 1 ano, rendimento por mês.
- Aplicar/Resgatar é **transferência** (sai/volta do saldo em conta, não é despesa).
- Dados do Murylo: conta remunerada **Mercado Pago, 105% do CDI**, começou em 04/10/2026.

### Ajustes
Aparência (Escuro/Claro) · 🦆 Pato (Desligado/De boa/Zoeiro/Insuportável) · Backup (exportar/importar JSON, exportar CSV) · Cartões · Categorias · Seus dados (apagar tudo) · 🔄 Buscar atualização · Versão do app.

### 🦆 Pato (commitado, ainda não publicado)
- Anda na barra de baixo em todas as abas e **fala sozinho** (intervalo conforme o nível), lendo os dados: cobra **contas sem pagar pelo nome**, categoria campeã, comparação com o mês passado, saldo baixo/negativo, previsão no vermelho, combustível, parcelas acabando, investimento, gastos fixos pesados.
- **Falas por aba** (Investir, Previsão, Lançamentos, Resumo, Ajustes) ao entrar na aba; reage ao **salvar gasto/receita/abastecimento**.
- **Cutucar** 3× = fica bravo (avermelha + tremida). **Segurar e arrastar** = carrega (pernas pedalando); **soltar rápido** = joga (física com quique nas bordas e no chão) e ele briga.
- **Mais de 100 falas** em bancos (`DUCK_GERAIS`, `DUCK_ECONOMIA`, `DUCK_EXAGERO`, `DUCK_SALDO_BAIXO`, `DUCK_CHATO`, e ao salvar: `DUCK_COMPRA`, `DUCK_REPETIDA`, `DUCK_IMPULSO`, `DUCK_GRANDE`). Ao salvar, reage conforme o gasto: grande (2,5× a média e ≥ R$ 150), repetido (3ª vez na categoria no mês), pequeno (≤ R$ 30) ou comum.
- **Piadas pelo assunto** (`DUCK_TEMAS`, `DUCK_TEMAS_IN`, função `duckTema`): pela descrição (oficina/conserto → "Esse carro velho quebrou de novo?", lanche caro, iFood, Netflix/Spotify (cita o outro streaming que já paga), aluguel, luz, academia, Shopee, apostas...) e, sem palavra conhecida, pela categoria. Ao salvar usa o tema 75% das vezes; nas falas soltas, `duckLembra` sorteia 2 lançamentos reais dos últimos 30 dias ("Lembrei daquele "Lanche" de R$ 50 no dia 12").
- **Não repete**: `duckFresh` lembra as últimas 60 falas (localStorage `financas.pato.falas`, separado dos dados).
- **Andar (desde 17/10)**: anda pela tela toda em 8 direções (`duckTick`, `duckWander`), escolhe um ponto, anda, para e escolhe outro. Quadro segue a distância andada (`D8.walkPx`/`runPx`). Jogar o pato agora escorrega com atrito (vista de cima), sem gravidade.
- **Cenas** (`duck.busy`; interrompidas se pegarem o pato): despesa nova que baixa o saldo → nota aparece ao lado do saldo, ele pega (gesto só em SW) e foge pela borda, saldo desce contando (`duckHeist`); receita → entra correndo com a nota, larga e o saldo sobe (`duckBring`); pegadinha → vai até uma conta não paga, marca de mentira (classe `.pay.fake`, não mexe nos dados) e desmarca (`duckPrank`). Gancho: `duckMoney(x, lista)` depois de salvar lançamento novo avulso, gasto fixo novo ou abastecimento; se não mexe no saldo (a pagar, cartão, mês que vem) ele só "segura" a nota (`DUCK_SEGURA`).
- **Mais cenas (17/10)**: tocar nele fugindo com a nota/o + faz largar (`duck.dropFn`; a nota volta ao saldo, que continua certo); plantão em conta não paga que vence até amanhã, batendo o pé (`duckGuard`, até 45 s); comemora quando marca conta como paga (`duckPaid`, pose aplaude); aponta a categoria campeã (`duckTopCat`); anda junto com a rolagem e tropeça se for rápida; segurar o dedo parado chama o pato (`duckFollow`); último dia do mês no positivo traz nota de bônus de enfeite (`duckBonus`, uma vez por mês, localStorage `financas.pato.bonus`).
- **Vencimento** (opcional, só despesa): `due` (data) no lançamento e no gasto fixo (no fixo vale o mesmo dia todo mês, `ruleDue`). Aparece nas Contas do mês ("vence amanhã" em laranja, "venceu" em vermelho) e ordena a lista.
- **De frente ao falar**: `pato-frente.webp`, 6 poses × 4 quadros (`DUCK_POSES`: oculos, bracos, aponta, cobre, aplaude, chama). Metade das vezes usa a pose que combina com a fala (`tagPose`), senão sorteia; nunca repete a anterior. Origem: `arte/Imagem do ChatGPT … 03_34_30/03_34_47.png`.
- Ideias de interação ainda não feitas: bloquear o botão + ("Tem certeza?"), reagir a apagar/diminuir gasto, esconder o saldo com a asa, tremer a tela, bater no vidro, medalhas.
- Para animação melhor no futuro: Rive (rive.app), com o pato em partes.

### 🎤 Voz (escondida)
- Código pronto (botão acima do +, reconhecimento de voz + interpretação da frase: valor, categoria, cartão, data).
- **Escondida** com `VOICE_ON = false`: no iPhone (app da Tela de Início) a voz só funciona **uma vez por abertura do app** (limitação da Apple; recarregar não resolve). Ideia para o futuro: usar o ditado do teclado.

## Versões publicadas
2.2 formato de versão · 2.3 botão de voz · 2.4/2.5 tentativas de voz no iPhone · 2.6 voz escondida · 2.7 previsão em gráfico + receitas em verde · **2.8 pato fiscal (andar 32 quadros, poses, falas), ícone novo, débito avulso já pago** (última publicada).

## Pendente
- **2.9** commitada, falta `git push` quando o Murylo pedir: piadas do pato pelo assunto dos lançamentos.
- **Não commitado (17/10)**: nome Duck, tema preto + amarelo-pato, ícones no estilo SF Symbols, pato de 8 direções com nota, pegadinha da conta e do + (`duckFabRun`: chega pela esquerda, o + encolhe até o bico, foge e devolve), barra de baixo em pílula flutuante só com ícones e o + ao lado. Publicar como **2.10** quando ele pedir.
- No iPhone o ícone novo (da 2.8) pode não trocar sozinho: apagar o atalho e adicionar de novo (exportar backup antes!).

## Ideias combinadas para depois
- Ampliar as palavras de cada categoria (para a voz) e o app "aprender" com correções.
- 🔔 Vencimento das contas fixas (vence hoje / atrasada).
- 💾 Lembrete semanal de backup.
- 🎯 Limite por categoria · ⛽ consumo do carro (litros/km) · 💳 quando cada parcela acaba · 📊 resumo do ano · 🐷 meta de economia.

## Limitações conhecidas
- **No PC (localhost) o app não usa service worker** (desregistra e limpa caches ao abrir; versão aparece "2.8 (PC)"): sempre carrega arquivos novos e funciona no navegador do Claude, onde o service worker não alcança a rede.
- GitHub Pages manda cache de 10 min; o `sw.js` busca com `no-store`/`reload` e recarrega sozinho quando há versão nova.
- Dados do app instalado no iPhone ≠ dados do Safari normal ≠ dados do navegador do PC (cada um é separado). Para levar dados: Exportar backup → Importar backup.
- Se apagar o ícone do app ou limpar os dados do Safari, os dados somem: manter backup.
- O CDI atual é usado para todo o histórico (atualizar o saldo de vez em quando corrige).
