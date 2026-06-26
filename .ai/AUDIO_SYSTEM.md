# Audio System — Ecokids

> Documentação do sistema global de áudio do Ecokids.
> Criado em: 2026-06-25
> Última atualização: 2026-06-25

---

## Visão Geral

O sistema de áudio do Ecokids é uma infraestrutura centralizada, extensível e reutilizável que vive no pacote `@ecokids/ui`. Ele foi projetado para ser o **padrão definitivo** de gerenciamento de áudio em todos os apps do monorepo.

### Apps com suporte atual

| App | Sons disponíveis | Controles |
|---|---|---|
| `scorer` | `background` (música), `success`, `click` | Canto inferior direito (flutuante) |
| `viewer` | `click` | Canto direito do header |

---

## Arquitetura

```
packages/ui/src/audio/
├── audio-manager.ts     ← Classe AudioManager (singleton por Provider)
├── audio-store.ts       ← Estado reativo + persistência localStorage
├── audio-provider.tsx   ← React Context Provider
├── use-audio.ts         ← Hook principal
├── use-click-sound.ts   ← Hook especializado para botões
└── index.ts             ← Barrel exports

apps/<app>/src/
├── audio.ts             ← Registro dos sons do app
└── assets/audio/
    ├── click.mp3
    ├── music.mp3        (scorer only)
    └── success.mp3      (scorer only)
```

### Fluxo de dados

```
audioStore (localStorage) ←→ AudioProvider ↔ AudioManager
                                    ↑
                              useAudio() hook
                                    ↑
                           Components / Pages
```

---

## API Pública

### Importação

```ts
import { AudioProvider, useAudio, useClickSound } from '@ecokids/ui'
import type { SoundDefinition } from '@ecokids/ui'
```

### `AudioProvider`

Deve envolver toda a aplicação (ou a parte que usa áudio). Recebe a lista de sons registrados do app.

```tsx
<AudioProvider sounds={myAppSounds}>
  <App />
</AudioProvider>
```

### `useAudio()`

Hook principal para controle de áudio.

```ts
const {
  // Playback
  playSound,    // (key: string, onEnded?: () => void) => void
  playMusic,    // (key: string) => void
  pauseMusic,   // (key?: string) => void
  resumeMusic,  // () => void

  // Volume
  setVolume,       // (0-100) => void — volume geral
  setMusicVolume,  // (0-100) => void — volume da categoria música
  setSfxVolume,    // (0-100) => void — volume dos efeitos

  // Mute
  mute,        // () => void
  unmute,      // () => void
  toggleMute,  // () => void

  // Estado reativo (para UI)
  isMuted,      // boolean
  volume,       // number (0-100)
  musicVolume,  // number (0-100)
  sfxVolume,    // number (0-100)
} = useAudio()
```

### `useClickSound()`

Hook especializado para sons de botões. Inclui debounce de 50ms para evitar spam.

```ts
const { onClick } = useClickSound()

// Uso simples
<button onClick={onClick}>Press me</button>

// Composição com handler próprio
<button onClick={() => { onClick(); myHandler() }}>Press me</button>
```

---

## Categorias de Som

### `music`
- Gerenciado por `HTMLAudioElement`
- Suporta `loop`
- Tem fade in/out (400ms) automático
- Controle de volume por `musicVolume`

### `sfx`
- Gerenciado por `Web Audio API` (`AudioBuffer`)
- Latência mínima
- Múltiplas instâncias simultâneas
- Controle de volume por `sfxVolume`

---

## Persistência

As preferências do usuário são salvas automaticamente no `localStorage`:

```json
{
  "muted": false,
  "volume": 50,
  "musicVolume": 80,
  "sfxVolume": 100
}
```

**Chave**: `ecokids:audio-preferences`

---

## Autoplay em Mobile/Tablet

Navegadores modernos (Chrome, Safari, Android WebView) bloqueiam autoplay sem interação do usuário.

**Estratégia implementada:**
1. `AudioContext` inicia em estado `suspended`
2. O `AudioManager` adiciona listeners de `click`, `touchstart` e `keydown` na primeira renderização
3. Na primeira interação, o contexto é resumido e os buffers de SFX são carregados
4. A música ambiente no scorer inicia quando o step muda (o que sempre ocorre após interação do usuário)

> **Resultado**: Funciona corretamente em tablets Android, Chrome mobile, Safari iPad e WebViews.

---

## Como Adicionar um Novo Som

### Passo 1: Adicionar o arquivo MP3

Coloque o arquivo em `apps/<app>/src/assets/audio/`:

```bash
apps/scorer/src/assets/audio/novo-som.mp3
```

### Passo 2: Registrar no arquivo `audio.ts` do app

```ts
// apps/scorer/src/audio.ts
import novoSomSrc from '@/assets/audio/novo-som.mp3'

export const scorerSounds: SoundDefinition[] = [
  // ... sons existentes ...
  {
    key: 'novo-som',
    src: novoSomSrc,
    category: 'sfx',  // ou 'music'
    volume: 1,
  },
]
```

### Passo 3: Usar no componente

```ts
const { playSound } = useAudio()
playSound('novo-som')
```

---

## Exemplos de Uso Futuro

```ts
// Som ao ganhar pontos
playSound('points-earned')

// Som ao desbloquear prêmio
playSound('award-unlocked')

// Som ao abrir modal
playSound('modal-open')

// Música especial para uma tela
playMusic('celebration')
pauseMusic()

// Controle fino de volume
setMusicVolume(60)   // reduz música para 60%
setSfxVolume(100)    // efeitos no máximo
```

---

## Controles de Volume

### Volume global (`volume`)
- Range: 0–100
- Afeta proporcionalmente músicas e efeitos

### Volume por categoria
- `musicVolume`: multiplica o volume da categoria `music` (0–100)
- `sfxVolume`: multiplica o volume da categoria `sfx` (0–100)

**Exemplo**: `volume=50`, `musicVolume=80` → música toca com volume efetivo de 40% (0.5 × 0.8).

---

## Posicionamento dos Controles de UI

### Scorer
```
Posição: fixed bottom-5 right-5
Z-index: 50
Comportamento: hover para expandir o slider de volume
```

### Viewer
```
Posição: absolute right-4 (dentro do header)
Comportamento: hover para expandir o slider de volume
```

---

## Troubleshooting

**Som não toca no mobile:**
- O som só toca após a primeira interação do usuário. Isso é esperado e intencional.

**Som continua tocando após navegar:**
- Verifique se o `AudioProvider` está no nível correto da árvore de componentes. Se for necessário parar o som em uma rota específica, use `pauseMusic()` em um `useEffect` com cleanup.

**Múltiplas instâncias de música:**
- O `AudioManager` garante que apenas uma música toca por vez. Chamar `playMusic('outro')` faz fade out da música atual automaticamente.

**TypeScript error "must be inside AudioProvider":**
- Certifique-se que o componente que usa `useAudio()` ou `useClickSound()` está dentro do `<AudioProvider>` na árvore de componentes.
