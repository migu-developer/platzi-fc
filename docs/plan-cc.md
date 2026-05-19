# Platzi FC — Plan de Ejecucion y Stack Tecnico

## Contexto

Plan tecnico para construir la web oficial de **Platzi FC**, un club de futbol ficticio. El documento de requerimientos (`platzi-fc-requerimiento.md`) define 19+ secciones, 20+ modelos de datos y tres fases funcionales (MVP → V1 → V2). Este plan traduce esos requerimientos en decisiones tecnologicas, arquitectura, fases de trabajo y criterios de verificacion.

---

## 1) Stack Tecnico

| Capa | Tecnologia | Justificacion |
|---|---|---|
| **Framework** | Next.js 15 (App Router) | SSG/ISR para SEO, Server Components para rendimiento, Metadata API, streaming SSR para partido en vivo (V2) |
| **Estilos** | Tailwind CSS 4 + shadcn/ui | Utilidades atomicas + componentes accesibles y personalizables sin dependencia de libreria pesada |
| **CMS** | Sanity | Portable Text mapea a los campos `_bloques` del modelo de datos, GROQ flexible, Studio embebible, edicion colaborativa en tiempo real |
| **Base de datos** | Sanity Content Lake (principal) + Vercel Postgres (auxiliar V1+) | Content Lake para contenido editorial/deportivo. Postgres (Neon) para cuentas fan, preferencias y suscripciones desde V1 |
| **Busqueda** | GROQ nativo (MVP) → Algolia (V1) | MVP: busqueda simple via GROQ. V1: busqueda facetada instantanea con filtros de dominio deportivo |
| **Video** | Mux | Streaming adaptativo, thumbnails automaticos, plugin nativo con Sanity |
| **Imagenes** | Sanity Image Pipeline + Next.js Image | Transformaciones on-the-fly, optimizacion automatica, lazy loading |
| **Hosting** | Vercel | ISR/on-demand revalidation, edge delivery, preview deployments, integracion nativa con Next.js y Sanity |
| **Email/Newsletter** | Resend + React Email | Templates en React, buena entregabilidad, integracion directa con Server Actions |
| **Analytics** | Vercel Web Analytics + GA4 | Core Web Vitals (Vercel) + analytics de negocio (GA4) con gestion de consentimiento |
| **Tiempo real (V2)** | Ably o SSE + Vercel KV | Pub/sub para match center en vivo, o polling con cache Redis |
| **i18n (V1)** | next-intl | Soporte nativo App Router, traducciones en Server Components, formatos localizados |
| **Auth (V1)** | Auth.js | Magic links por email, sesiones en Vercel Postgres |
| **Testing** | Vitest + Playwright + Storybook | Unit/integration (Vitest), E2E (Playwright), desarrollo visual (Storybook) |
| **Monitoreo** | Sentry + Vercel Logs | Error tracking, performance monitoring, logs de funciones serverless |
| **CI/CD** | GitHub Actions + Vercel | Lint, type-check, tests, preview deploys por PR, deploy a produccion |

---

## 2) Arquitectura del Proyecto

### Monorepo con Turborepo

```
platzi-fc/
├── apps/
│   ├── web/                          # Next.js 15 App Router
│   │   ├── app/
│   │   │   ├── (site)/               # Grupo de rutas publicas
│   │   │   │   ├── page.tsx                    # Inicio
│   │   │   │   ├── partidos/
│   │   │   │   │   ├── page.tsx                # Calendario / Resultados
│   │   │   │   │   └── [slug]/
│   │   │   │   │       └── page.tsx            # Detalle de partido
│   │   │   │   ├── equipo/
│   │   │   │   │   ├── page.tsx                # Plantilla
│   │   │   │   │   └── [slug]/
│   │   │   │   │       └── page.tsx            # Perfil de jugador
│   │   │   │   ├── competicion/
│   │   │   │   │   └── [slug]/
│   │   │   │   │       └── page.tsx            # Landing de competicion
│   │   │   │   ├── noticias/
│   │   │   │   │   ├── page.tsx                # Listado de noticias
│   │   │   │   │   └── [slug]/
│   │   │   │   │       └── page.tsx            # Detalle de noticia
│   │   │   │   ├── media/
│   │   │   │   │   ├── page.tsx                # Videos
│   │   │   │   │   └── galerias/
│   │   │   │   │       └── [slug]/page.tsx     # Detalle galeria
│   │   │   │   ├── entradas/
│   │   │   │   │   └── page.tsx                # Comprar entradas
│   │   │   │   ├── tienda/
│   │   │   │   │   ├── page.tsx                # Inicio tienda
│   │   │   │   │   └── [slug]/page.tsx         # Producto
│   │   │   │   ├── club/
│   │   │   │   │   ├── page.tsx                # Club hub
│   │   │   │   │   ├── historia/page.tsx
│   │   │   │   │   ├── estadio/page.tsx
│   │   │   │   │   ├── fundacion/page.tsx
│   │   │   │   │   └── contacto/page.tsx
│   │   │   │   ├── fans/page.tsx
│   │   │   │   ├── sponsors/page.tsx
│   │   │   │   ├── academia/page.tsx
│   │   │   │   ├── legal/
│   │   │   │   │   ├── terminos/page.tsx
│   │   │   │   │   ├── privacidad/page.tsx
│   │   │   │   │   └── accesibilidad/page.tsx
│   │   │   │   └── busqueda/page.tsx
│   │   │   ├── api/                            # API routes (webhooks, revalidacion)
│   │   │   ├── layout.tsx                      # Root layout
│   │   │   ├── not-found.tsx                   # 404
│   │   │   └── error.tsx                       # 500
│   │   ├── components/
│   │   │   ├── ui/               # shadcn/ui base
│   │   │   ├── layout/           # Header, Footer, Nav, Breadcrumbs
│   │   │   ├── match/            # MatchCard, Scoreboard, LineupTable, EventTimeline
│   │   │   ├── team/             # PlayerCard, StaffCard, RosterGrid
│   │   │   ├── news/             # ArticleCard, ArticleBody, CategoryFilter
│   │   │   ├── media/            # VideoPlayer, Gallery, MediaGrid
│   │   │   ├── commerce/         # TicketCTA, ProductCard, ShopGrid
│   │   │   └── shared/           # SEO, Pagination, FilterBar, SearchBox
│   │   ├── lib/
│   │   │   ├── sanity/           # Cliente, queries GROQ, helpers de imagen
│   │   │   ├── algolia/          # Cliente de busqueda, indexacion (V1)
│   │   │   ├── analytics/        # GA4, consentimiento
│   │   │   └── utils/            # Formatters, constantes
│   │   ├── styles/
│   │   │   └── globals.css
│   │   └── public/               # Assets estaticos
│   │
│   └── studio/                   # Sanity Studio
│       ├── schemas/
│       │   ├── documents/        # Season, Competition, Team, Match, Player, etc.
│       │   ├── objects/          # Bloques, SEO, redes sociales, stats
│       │   └── index.ts
│       ├── desk/                 # Estructura personalizada del escritorio
│       └── sanity.config.ts
│
├── packages/
│   ├── config-tailwind/          # Config compartida (colores del club, tipografia)
│   ├── config-typescript/        # tsconfig compartido
│   ├── types/                    # Interfaces TypeScript (espejo de modelos de datos)
│   └── sanity-schemas/           # Schemas compartidos (studio + codegen)
│
├── turbo.json
├── package.json
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
└── docs/
    └── plan-cc.md                # Este documento
```

### Decisiones arquitectonicas clave

- **Route groups `(site)`** separan las rutas publicas. En V1/V2 se agrega `(auth)` para cuentas de fan.
- **Sanity Studio como app independiente** dentro del monorepo, desplegable en `studio.platzifc.com`. Comparte schemas y tipos con `web`.
- **`packages/types`** garantiza que las interfaces TypeScript derivadas de los schemas de Sanity sean compartidas entre `web` y `studio`, evitando drift.
- **Turborepo** gestiona cache de build y orquestacion de tareas entre apps y packages.

---

## 3) Fases de Ejecucion

### Fase 0 — Fundacion (4 semanas / 2 sprints)

#### Sprint 0.1 — Scaffolding e Infraestructura
- Inicializar monorepo Turborepo
- Crear app Next.js 15 con App Router
- Configurar Tailwind CSS 4 + shadcn/ui
- Crear proyecto Sanity y app Studio
- Configurar proyecto en Vercel con preview deployments
- CI/CD basico: lint, type-check, build (GitHub Actions)
- ESLint, Prettier, Husky pre-commit hooks
- Skeleton de Vitest y Playwright
- Definir interfaces TypeScript compartidas desde modelos de datos
- **Entregable:** Shell vacio desplegable en Vercel, Studio accesible

#### Sprint 0.2 — Design System y Layout Core
- Root layout: Header, Footer, estructura de navegacion
- Componentes UI base: Button, Card, Badge, Tabs, Input, Select
- Navegacion responsive: mega-menu desktop, drawer mobile
- Tokens de tipografia y color del club en Tailwind
- Componentes compartidos: Breadcrumbs, Pagination, FilterBar
- Componente SEO: wrapper de Metadata API + helper JSON-LD
- Cliente Sanity con helpers de queries GROQ
- **Entregable:** Shell navegable con design system, conectado a Sanity

---

### Fase 1 — MVP (8 semanas / 4 sprints)

#### Sprint 1.1 — Contenido Core (Noticias + Institucional)
**Schemas Sanity:** Article, OfficialCommunication, MediaAsset, Config/Taxonomias

| Pagina | Funcionalidad |
|---|---|
| Noticias (listado) | Paginacion, filtros por categoria |
| Noticia (detalle) | Portable Text, media embeds, articulos relacionados |
| Comunicados oficiales | Listado con archivos adjuntos |
| Club (secciones) | Historia, Identidad, Estadio, Fundacion, Transparencia, Contacto |
| Legal | Terminos, Privacidad, Accesibilidad |

- **Entregable:** Pipeline editorial completo de CMS a articulo publicado

#### Sprint 1.2 — Datos Deportivos Core (Partidos + Equipo)
**Schemas Sanity:** Season, Competition, Team, Match, Player, Staff, Standings

| Pagina | Funcionalidad |
|---|---|
| Partidos (listado) | Calendario (proximos) y Resultados (pasados), filtros temporada/competicion |
| Partido (detalle) | Marcador, contexto, tab de resumen |
| Equipo (plantilla) | Grid con filtros posicion/nacionalidad |
| Jugador (perfil) | Bio, foto, stats basicas |
| Staff | Listado y perfiles |
| Competicion (landing) | Tabla/clasificacion, calendario, resultados del club |

- **Entregable:** Experiencia completa de consulta de datos deportivos

#### Sprint 1.3 — Comercio, Media, Busqueda y Secciones Restantes
**Schemas Sanity:** TicketProduct, ShopProduct, Sponsor, MembershipPlan, FanEvent

| Pagina | Funcionalidad |
|---|---|
| Entradas | Landing con listado de partidos y CTAs externos |
| Tienda | Grid de productos, categorias, CTAs a checkout externo |
| Sponsors | Grid por tier |
| Media — Videos | Listado y detalle (Mux player o embed) |
| Media — Galerias | Listado y detalle |
| Fans | Beneficios membresia, eventos comunidad, FAQ |
| Academia | Programas, CTA inscripcion |
| Busqueda | Busqueda simple via GROQ (noticias, jugadores, partidos) |

- **Entregable:** Las 19+ secciones funcionales con contenido del CMS

#### Sprint 1.4 — SEO, Performance y Preparacion de Lanzamiento
- JSON-LD: Organization, SportsTeam, SportsEvent, NewsArticle, VideoObject
- `sitemap.xml` dinamico y `robots.txt`
- Open Graph y Twitter Cards en todas las paginas
- Auditoria de optimizacion de imagenes
- Optimizacion Core Web Vitals: LCP en Home y Partido detalle
- Paginas de error personalizadas: 404 y 500
- Auditoria de accesibilidad: navegacion por teclado, ARIA, contraste
- Documentacion Storybook de componentes core
- Tests E2E para flujos criticos
- **Entregable:** MVP listo para lanzamiento

---

### Fase 2 — V1 (8 semanas / 4 sprints)

#### Sprint 2.1 — Match Center Avanzado
- Tabs de partido: comparativa de stats, visualizacion de alineaciones, timeline de eventos
- Minuto a minuto con display de eventos
- Media relacionada al partido (galeria, video)
- Match card mejorada con indicadores de estado
- Persistencia de selectores temporada/competicion (URL params + cookies)

#### Sprint 2.2 — Biblioteca Media + i18n
- Integracion Mux para hosting y streaming de video
- Navegacion media mejorada: playlists, media relacionada, filtros por taxonomia
- Soporte podcast/audio (opcional)
- Setup next-intl: rutas por locale, archivos de traduccion, i18n en Server Components
- Localizacion de strings UI (ES primario, EN secundario)
- Formatos de fecha, numero y moneda localizados

#### Sprint 2.3 — Engagement de Fans + Newsletter
- Newsletter opt-in con Resend
- Suscripcion a alertas de partidos (email)
- Modulo de membresia fan con beneficios
- Login opcional (Auth.js con magic links)
- Vercel Postgres para cuentas fan y preferencias
- Banner de consentimiento de cookies con gestion de preferencias
- GA4 con tracking condicionado a consentimiento

#### Sprint 2.4 — Algolia Search + Pulido
- Integracion Algolia: indexacion via webhooks de Sanity
- UI InstantSearch: busqueda facetada en todos los tipos de contenido
- Analytics de busqueda y ajuste de relevancia
- Pase de optimizacion de performance
- Expansion de suite E2E
- Tests de regresion visual (Storybook + Chromatic)

---

### Fase 3 — V2 (8 semanas / 4 sprints)

#### Sprint 3.1 — Match Center en Vivo
- Pipeline de datos en tiempo real: API deportiva externa o actualizacion manual desde CMS
- Infraestructura WebSocket/SSE (Ably o Vercel KV + polling)
- Marcador en vivo con eventos auto-actualizados
- Minuto a minuto en vivo con push updates
- Transiciones de estado del partido (pre, en vivo, descanso, finalizado)

#### Sprint 3.2 — Cuentas Fan + Personalizacion
- Cuenta fan completa: perfil, preferencias, jugadores favoritos
- Personalizacion de homepage basada en preferencias
- Recomendaciones de contenido personalizadas
- Gestion de preferencias de notificaciones
- Historial y contenido guardado

#### Sprint 3.3 — Integracion Profunda de Comercio
- Integracion API de ticketing (seleccion de asiento, checkout in-site)
- Integracion API de e-commerce (carrito, checkout dentro del sitio)
- Flujo de compra de abonos/membresias
- Historial de ordenes en cuenta fan

#### Sprint 3.4 — Workflows Editoriales + Contenido Historico
- Workflows avanzados en Sanity: revision, programacion, aprobacion, publicacion
- Sugerencias automaticas de contenido relacionado
- Archivo historico de temporadas con stats navegables
- Herramientas de migracion de datos legacy
- Auditoria final de performance y accesibilidad
- Load testing para picos de trafico en dia de partido

---

## 4) Infraestructura y DevOps

### Ambientes

| Ambiente | Plataforma | Dataset Sanity | Proposito |
|---|---|---|---|
| `development` | Local | dev | Desarrollo diario |
| `preview` | Vercel Preview (por PR) | staging | Revision de codigo y QA |
| `staging` | Vercel Staging | staging | Pre-produccion |
| `production` | Vercel Production | production | Sitio publico |

### Pipeline CI/CD (GitHub Actions)

```
On Pull Request:
  ├── Lint (ESLint + Prettier)
  ├── Type check (tsc --noEmit)
  ├── Unit tests (Vitest)
  ├── Build (turbo build)
  ├── E2E tests (Playwright vs preview deploy)
  └── Vercel preview deployment

On merge to main:
  ├── Todos los checks de CI
  ├── Deploy a staging
  ├── Smoke tests contra staging
  └── Promocion manual a produccion

On Sanity publish (webhook):
  └── Revalidacion on-demand via API route de Next.js
```

### Estrategia de Caching

| Pagina | Estrategia | Revalidacion |
|---|---|---|
| Home | ISR | 60s (dia de partido: 10s) |
| Noticia detalle | SSG | On-demand via webhook Sanity |
| Partido detalle | ISR | 60s (pre/post). SSR o short-poll en vivo (V2) |
| Jugador perfil | SSG | On-demand via webhook Sanity |
| Clasificacion | ISR | 5 minutos |
| Busqueda | Client-side | Algolia (V1) |

### Monitoreo

- **Vercel Analytics** — Core Web Vitals y metricas de usuario real
- **Vercel Logs** — Monitoreo de funciones serverless
- **Sentry** — Error tracking y performance monitoring
- **Uptime** — Monitoreo de disponibilidad para paginas criticas

---

## 5) Integraciones

| Integracion | Fase | Enfoque |
|---|---|---|
| **Sanity CMS** | MVP | Queries GROQ via `next-sanity`, revalidacion por webhook, edicion visual con draft mode |
| **Mux Video** | V1 | Plugin Sanity-Mux para upload/gestion, Mux Player React para reproduccion |
| **Algolia** | V1 | Webhook Sanity dispara indexacion, `react-instantsearch` para UI |
| **Resend** | V1 | Server Actions para signup newsletter, templates con React Email |
| **GA4** | V1 | `@next/third-parties` para carga de scripts, inicializacion condicionada a consentimiento |
| **Ticketing** | MVP: CTA externo / V2: API | MVP: enlaces salientes. V2: seleccion de asiento via API |
| **E-commerce** | MVP: CTA externo / V2: API | MVP: catalogo en Sanity, CTA a tienda externa. V2: Shopify Storefront API o similar |
| **Auth.js** | V1 | Magic links email, sesiones en Vercel Postgres |
| **Tiempo real** | V2 | Ably pub/sub o SSE con Vercel KV cache |
| **Sentry** | MVP | `@sentry/nextjs` para errores y performance |

---

## 6) Timeline Estimado

| Fase | Duracion | Acumulado |
|---|---|---|
| Fase 0: Fundacion | 4 semanas | 4 semanas |
| Fase 1: MVP | 8 semanas | 12 semanas (~3 meses) |
| Fase 2: V1 | 8 semanas | 20 semanas (~5 meses) |
| Fase 3: V2 | 8 semanas | 28 semanas (~7 meses) |

### Equipo recomendado

| Rol | Dedicacion | Desde |
|---|---|---|
| Frontend developer (x2) | Tiempo completo | Fase 0 |
| CMS / Backend developer | Tiempo completo | Fase 0 |
| Disenador UI | Medio tiempo | Sprint 0.2 |
| QA | Medio tiempo | Sprint 1.3 |

---

## 7) Riesgos y Mitigaciones

| Riesgo | Impacto | Mitigacion |
|---|---|---|
| Picos de trafico en dia de partido | Alto | ISR + edge caching, load testing en Sprint 3.4, auto-scaling de Vercel |
| Performance de queries GROQ con datasets grandes | Medio | Optimizacion de queries, paginacion, proyecciones (solo campos necesarios) |
| Adopcion de Sanity por equipo editorial | Medio | Estructura de escritorio personalizada, sesiones de capacitacion, documentacion |
| Fiabilidad de APIs externas (ticketing/e-commerce) | Medio | Degradacion elegante a CTAs externos, circuit breaker patterns |
| Scope creep entre fases | Alto | Gates estrictos por fase, mentalidad MVP-first, feature flags para rollout progresivo |

---

## 8) Verificacion

### MVP — Criterios de aceptacion
- [ ] Todas las 19+ secciones renderizan contenido desde Sanity
- [ ] Lighthouse Performance >= 90 en Home y Partido detalle
- [ ] Lighthouse SEO >= 95 en todas las paginas
- [ ] JSON-LD valido (Google Rich Results Test)
- [ ] Sitemap.xml generado con todas las URLs
- [ ] Navegacion completa funcional (desktop y mobile)
- [ ] Busqueda basica retorna resultados de noticias, jugadores y partidos
- [ ] Tests E2E pasan para flujos criticos
- [ ] Preview deployments funcionales por PR
- [ ] Equipo editorial puede crear y publicar contenido desde Sanity Studio

### V1 — Criterios de aceptacion
- [ ] Match center con tabs de stats, alineaciones y eventos
- [ ] Sitio disponible en ES y EN
- [ ] Newsletter funcional (signup → email de confirmacion)
- [ ] Busqueda Algolia con filtros facetados
- [ ] Login fan con magic link funcional
- [ ] Consentimiento de cookies gestionado correctamente

### V2 — Criterios de aceptacion
- [ ] Marcador en vivo se actualiza sin refresh manual
- [ ] Fan puede personalizar homepage segun preferencias
- [ ] Flujo completo de compra de entradas in-site
- [ ] Flujo completo de compra en tienda in-site
- [ ] Load test: sitio estable con 10x trafico normal en dia de partido
