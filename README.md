# Portafolio IA — Luis Llatas

Portafolio personal de Full Stack Developer & AI. Sitio estático con React + Vite + Tailwind.

## Stack

- **React 18** + **Vite 6**
- **Tailwind CSS** + shadcn/ui (solo los componentes que se usan)
- **Framer Motion** (animaciones de entrada)
- **Lucide React** (iconos)
- **React Router** (Home + 404)

## Requisitos

- Node.js 18+ (en Windows, `node` y `npm` en el PATH)

## Arranque local

```bash
npm install
npm run dev
```

Abre la URL que imprime Vite (normalmente `http://localhost:5173`).

## Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción en `dist/` |
| `npm run preview` | Previsualiza el build |
| `npm run lint` | ESLint |

## Estructura

```
src/
  assets/           # Imágenes (perfil_render.png, etc.)
  components/
    portfolio/      # Secciones del sitio (Hero, About, Skills…)
    ui/             # Componentes UI (toaster, etc.)
    ScrollToTop.jsx
  lib/              # utils (cn) y PageNotFound
  hooks/            # use-mobile
  pages/Home.jsx    # Página principal
  App.jsx           # Router
  main.jsx
  index.css
```

## Contenido

Los datos del portafolio (bio, skills, proyectos, certificaciones, contacto) están en los componentes de `src/components/portfolio/`. Para actualizar textos o enlaces, edita esos archivos.

## Despliegue

Cualquier hosting estático sirve (Vercel, Netlify, GitHub Pages, etc.):

```bash
npm run build
```

Publica el contenido de `dist/`.
