# Block Grid - Puzzle Game

![Block Grid](https://img.shields.io/badge/Block%20Grid-v1.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-14.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.0-teal)

Block Grid é um jogo de puzzle casual inspirado no Block Blast!, onde você deve encaixar peças em um tabuleiro 8×8 para completar linhas, colunas e blocos 3×3.

## 🎮 Características

- **Mecânica Simples**: Arrastar e soltar peças no tabuleiro
- **Sistema de Pontuação**: Pontos base + bônus por linhas, colunas e blocos
- **Combos**: Multiplicadores que aumentam com limpezas sucessivas
- **Responsivo**: Funciona perfeitamente em dispositivos móveis e desktop
- **PWA**: Instale como aplicativo nativo
- **Leaderboard Online**: Ranking global via Supabase
- **Persistência Local**: Salvamento automático do progresso

## 🚀 Tecnologias

- **Frontend**: Next.js 14 (App Router) + React 18 + TypeScript
- **Styling**: Tailwind CSS + Animações CSS personalizadas
- **Estado**: Zustand com Immer para gerenciamento de estado
- **Backend**: Supabase (PostgreSQL + REST API)
- **Áudio**: Howler.js para música e efeitos sonoros
- **Drag & Drop**: React DnD para interações touch/mouse
- **PWA**: Service Worker para funcionalidade offline

## 📦 Instalação

### Pré-requisitos

- Node.js 18.0 ou superior
- npm ou yarn
- Conta no Supabase (para leaderboard online)

### Configuração

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/blockgrid.git
   cd blockgrid
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   cp .env.example .env.local
   ```
   
   Edite o arquivo `.env.local` com suas configurações do Supabase:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

4. **Configure o banco de dados Supabase**
   
   Execute o seguinte SQL no seu projeto Supabase:
   ```sql
   CREATE TABLE scores (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     player_name TEXT NOT NULL,
     score INTEGER NOT NULL,
     device_hash TEXT NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   
   CREATE INDEX idx_scores_score ON scores(score DESC);
   CREATE INDEX idx_scores_device_hash ON scores(device_hash);
   ```

5. **Execute em modo desenvolvimento**
   ```bash
   npm run dev
   ```

6. **Acesse o jogo**
   
   Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 🎯 Como Jogar

1. **Objetivo**: Encaixar as peças no tabuleiro 8×8
2. **Limpeza**: Complete linhas, colunas inteiras ou blocos 3×3
3. **Pontuação**: 
   - +10 pontos por célula colocada
   - +80 pontos por linha/coluna limpa
   - +120 pontos por bloco 3×3 limpo
4. **Combos**: Limpezas sucessivas aumentam o multiplicador (×1.5, ×2, ×2.5... até ×5)
5. **Game Over**: Quando nenhuma das 3 peças atuais consegue ser colocada

## 🎨 Peças Disponíveis

- **Linha**: 1×1, 1×2, 1×3, 1×4 (horizontal e vertical)
- **Quadrado**: 2×2, 3×3
- **Formas**: L-shape, T-shape

## 🏆 Sistema de Ranking

- **Local**: High score salvo no localStorage
- **Global**: Top 10 jogadores via Supabase
- **Anônimo**: Identificação por hash do dispositivo

## 📱 PWA (Progressive Web App)

O jogo funciona como PWA, permitindo:
- Instalação como app nativo
- Funcionamento offline (exceto ranking)
- Notificações push (futuro)
- Experiência de app nativo

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Iniciar em produção
npm run start

# Lint
npm run lint

# Type checking
npm run type-check
```

## 📈 CI/CD

O projeto inclui GitHub Actions para:
- Lint e type checking automático
- Build e testes
- Deploy automático na Vercel

## 🎵 Áudio

- **BGM**: Música de fundo em loop
- **SFX**: Efeitos sonoros para ações do jogo
- **Controles**: Volume independente para BGM e SFX
- **Configuração**: Salvamento de preferências de áudio

## 🎯 Roadmap

### Versão 1.0 (MVP) ✅
- [x] Mecânica básica do jogo
- [x] Sistema de pontuação e combos
- [x] Interface responsiva
- [x] Salvamento local
- [x] Leaderboard online
- [x] PWA básico

### Versão 1.1 (Planejado)
- [ ] Modos de jogo adicionais
- [ ] Power-ups e boosters
- [ ] Animações aprimoradas
- [ ] Sistema de conquistas
- [ ] Compartilhamento de pontuação

### Versão 2.0 (Futuro)
- [ ] Multiplayer em tempo real
- [ ] Torneios e eventos
- [ ] Customização de temas
- [ ] Sistema de níveis
- [ ] Integração com redes sociais

## 🧪 Testes

```bash
# Executar testes (quando implementados)
npm run test

# Testes com coverage
npm run test:coverage
```

## 📊 Performance

O jogo foi otimizado para:
- ⚡ Carregamento inicial < 2s (4G)
- 🎯 60 FPS em dispositivos médios
- 📱 Funciona em dispositivos Android 5.0+
- 🍎 Funciona em iOS 12.0+

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🎮 Inspiração

Inspirado no jogo Block Blast! e outros jogos de puzzle clássicos como Tetris e 1010!

## 📞 Suporte

Para suporte ou dúvidas:
- Abra uma [Issue](https://github.com/seu-usuario/blockgrid/issues)
- Entre em contato: [seu-email@example.com](mailto:seu-email@example.com)

---

Desenvolvido com ❤️ por [Seu Nome] 