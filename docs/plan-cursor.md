# Plan de desarrollo Platzi FC (Cursor)

Este plan traduce [platzi-fc-requerimiento.md](../platzi-fc-requerimiento.md) en una hoja de ruta técnica y de contenido ejecutable con asistencia de IA en Cursor. Respeta el alcance del requisito: **estructura del proyecto (IA / arquitectura de contenido)**. No sustituye diseño visual, copies, wireframes, UI kit, backlog detallado, historias de usuario ni cronogramas.

---

## 1. Objetivo y principios

**Objetivo:** una web oficial de club ficticio (**Platzi FC**) con patrones de sitios profesionales: calendario/resultados como eje, hubs por entidad (partido, jugador, competición), capa institucional separada del contenido de temporada, y CTAs claros a entradas, tienda y membresías (muchas veces vía proveedor externo en MVP).

**Principios de implementación:**

1. **Contenido primero:** modelos de datos y taxonomías alineados con la especificación del requisito antes de pulir presentación.
2. **URLs estables:** temporada y competición como contexto en ruta o query persistente, no regenerar slugs que rompan enlaces.
3. **Evergreen vs temporada:** páginas institucionales y legales como contenido CMS largo plazo; partidos, plantilla y tablas como datos versionados por temporada.
4. **Entregas por fases** alineadas con MVP / V1 / V2 del documento fuente.

---

## 2. Stack recomendado (decisión base)

El requisito no impone stack. Para desarrollo ágil con buen encaje SEO, i18n y despliegue:

| Capa                 | Recomendación                                                                       | Motivo breve                                                            |
| -------------------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Framework            | Next.js (App Router)                                                                | Rutas por segmento, metadata SEO, ISR/revalidate para datos que cambian |
| CMS                  | Headless (p. ej. Sanity, Contentful, Payload) o MDX + datos JSON en repo para demo  | `body_bloques`, `biografia_bloques`, comunicados con adjuntos           |
| Datos deportivos MVP | JSON seed + capa `getMatches` / `getStandings` abstracta                            | Permite sustituir por API real sin reescribir UI                        |
| Búsqueda MVP         | `searchParams` + filtrado en servidor o índice ligero                               | V1 puede evolucionar a Algolia/Typesense                                |
| Auth fans (V1+)      | Proveedor (Auth.js + OAuth o similar) solo cuando exista módulo membresía con login |

Documentar la decisión final en el README del repo cuando se cree el proyecto.

---

## 3. Estructura de repositorio sugerida

```
apps/web/                 # Next.js (o raíz si monorepo no aplica)
  app/                    # Rutas App Router mapeadas al sitemap
  components/
  lib/
    cms/                  # Cliente CMS, queries, tipos generados
    data/                 # Repositorios: matches, players, standings
    seo/                  # helpers schema.org, sitemap
content/                  # Opcional: seeds o migraciones de taxonomías
packages/types/           # Opcional en monorepo: entidades compartidas
```

Convención: **un route segment por “tipo de página”** del requisito (listado vs detalle vs landing de torneo), compartiendo layouts por sección (Partidos, Equipo, Noticias, etc.).

---

## 4. Mapa ruta ↔ sitemap (MVP primero)

Implementar rutas de forma que el árbol del requisito sea navegable aunque algunas páginas sean stub o datos mock.

| Área                      | Rutas MVP mínimas                                                                                                            |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Inicio                    | `/`                                                                                                                          |
| Partidos                  | `/partidos`, `/partidos/calendario`, `/partidos/resultados`, `/partidos/[slug]`                                              |
| Competición               | `/competicion/[slug]` (tabla + enlaces a calendario del club filtrado)                                                       |
| Equipo                    | `/equipo/primer-equipo`, `/equipo/primer-equipo/plantilla`, `/equipo/primer-equipo/cuerpo-tecnico`, `/equipo/jugador/[slug]` |
| Noticias                  | `/noticias`, `/noticias/[categoria]`, `/noticias/[slug]`                                                                     |
| Media                     | `/media/videos`, `/media/videos/[slug]`, `/media/galerias`, `/media/galerias/[slug]`                                         |
| Entradas                  | `/entradas` + CTA desde partido                                                                                              |
| Tienda                    | `/tienda`, `/tienda/c/[slug]`, `/tienda/p/[slug]`                                                                            |
| Club                      | `/club/*` (historia, estadio, contacto, etc. como `[...slug]` o segmentos fijos)                                             |
| Fans / Sponsors / Academy | Landing por sección en MVP; profundidad en V1                                                                                |
| Legal                     | `/legal/terminos`, `/legal/privacidad`, `/legal/cookies`, `/legal/accesibilidad`                                             |
| Utilidades                | `/buscar`, `not-found`, `error`                                                                                              |

**Femenino / cantera:** mismos patrones de ruta con prefijo o segmento (`/equipo/femenino`, `/equipo/cantera/...`) y feature flag o datos vacíos hasta que exista contenido.

---

## 5. Modelos de datos y CMS

### 5.1 Entidades núcleo (alineación con el requisito)

Implementar tipos TypeScript (o Zod) que reflejen los modelos mínimos del documento: `Temporada`, `Competicion`, `Equipo`, `Partido`, `Jugador`, `Staff`, `TablaClasificacion`, `Noticia`, `ComunicadoOficial`, `MediaAsset`, `Video`, `Galeria`, `Estadio`, `TicketProduct`, `ShopProduct`, `Sponsor`, `MembershipPlan`, `FanEvent`, más `Config` / taxonomías.

**Prioridad de implementación en código:**

1. `Temporada`, `Competicion`, `Equipo`, `Estadio`, `Partido` (con estado y marcador).
2. `Jugador`, `Staff` enlazados a `equipo_id`.
3. `TablaClasificacion` (filas derivadas o ingestadas).
4. `Noticia` + categorías; `ComunicadoOficial` como extensión o tipo discriminado.
5. `Video`, `Galeria`, `MediaAsset`.
6. Productos ticket/tienda y sponsors como contenido principalmente CMS con URLs externas de checkout en MVP.

### 5.2 Bloques modulares

Unificar `body_bloques`, `descripcion_bloques`, `biografia_bloques` en un **sistema de bloques** del CMS (portable text o array JSON tipado) con componentes React por tipo de bloque (párrafo, imagen, embed, cita, CTA).

### 5.3 Taxonomías controladas

Sembrar desde el inicio: categorías de noticia, posiciones, roles de staff, tipos de media y tipo de competición. Evita drift de filtros y SEO.

---

## 6. Navegación

Implementar **Header** y **Footer** según las secciones del requisito; usar un objeto de configuración de navegación (tipo `nav.ts`) para no duplicar enlaces entre layout y sitemap.

**Navegación secundaria:** subnav por layout de sección (Noticias, Equipo, Partidos, Club, Media) leyendo la misma fuente de verdad o derivando del pathname.

---

## 7. Fases de producto (ejecución en Cursor)

### Fase A — MVP (orden sugerido de PRs / iteraciones)

1. **Scaffold:** Next.js, lint, formato, estructura de carpetas, layout global, header/footer, tema neutro (sin diseño final).
2. **Datos deportivos:** seeds de temporadas, competiciones, partidos, tabla, plantilla; funciones `lib/data/*` con interfaces claras.
3. **Rutas críticas:** inicio (bloques stub alineados al requisito), calendario/resultados, detalle de partido básico (marcador, contexto, tabs con contenido mínimo en “Resumen”).
4. **Equipo:** listado plantilla + perfil jugador + staff.
5. **Competición:** landing por torneo con tabla y enlaces.
6. **Noticias:** listado + detalle desde CMS o MDX; comunicados reutilizando modelo ampliado.
7. **Media:** listados + detalle video/galería.
8. **Entradas / Tienda:** landings + fichas con CTA a URL externa (`proveedor_checkout_url`).
9. **Club / Legal / 404 / buscar:** páginas mínimas + búsqueda simple sobre entidades indexadas.
10. **SEO base:** `metadata` por ruta, `sitemap.xml`, `robots.txt`, JSON-LD básico (Club, SportsEvent/Match donde aplique, NewsArticle).

### Fase B — V1

- Match center ampliado: estadísticas, alineaciones, eventos en detalle de partido.
- Selectores de temporada/competición con estado en URL.
- Media con taxonomías y filtros avanzados.
- i18n (rutas o prefijo `locale`), newsletter opt-in (formulario + proveedor), analítica y capa de consentimiento.
- Módulo Fans / membresía con login opcional y páginas de planes.

### Fase C — V2

- Match center tiempo real (WebSockets/SSE o proveedor).
- Cuenta de fan y personalización de home.
- Integración profunda ticketing/e-commerce si deja de ser solo CTA.
- Automatización de relacionados y workflows editoriales.

---

## 8. Buenas prácticas (checklist continuo en Cursor)

Tomado del requisito; usar como criterios de aceptación en revisiones:

- **Arquitectura de contenido:** separar evergreen en CMS vs datos de temporada en repositorios deportivos.
- **SEO:** hubs por jugador/partido/competición; schema donde tenga sentido.
- **Accesibilidad:** teclado, foco, tablas semánticas, `alt` en media.
- **Rendimiento:** priorizar home y partido; lazy-load en galerías y vídeos no above-the-fold; caching con `revalidate` acorde a frescura del dato.
- **i18n:** contenido localizable (no solo strings de UI) cuando se active V1.
- **Governance CMS:** workflows distintos noticia vs comunicado; bloques reutilizables.

---

## 9. Cómo usar Cursor en este proyecto

1. **Reglas del repo:** `.cursor/rules` o `AGENTS.md` con convenciones de rutas, nombres de slugs, y “no inventar campos fuera del modelo del requisito”.
2. **Skills:** activar guías de Next.js App Router y SEO cuando se toquen layouts y metadata.
3. **Tareas pequeñas:** una vertical a la vez (p. ej. “solo partidos MVP”) para mantener diffs revisables.
4. **Tipos como contrato:** cambiar primero `types` / Zod / CMS schema, luego UI.
5. **Datos de prueba:** carpeta `seed` o fixtures versionados para reproducir escenarios (partido en vivo, suspendido, sin alineación).

---

## 10. Riesgos y dependencias

| Riesgo                           | Mitigación                                                                                         |
| -------------------------------- | -------------------------------------------------------------------------------------------------- |
| Alcance del sitemap vs tiempo    | Stub de página con lista de enlaces “próximamente” solo donde el requisito permita landings vacías |
| Duplicación partido vs ticketing | Una sola entidad `Partido`; `TicketProduct` referencia `match_id`                                  |
| CMS distinto al modelo mental    | Mapeo explícito CMS → tipos TS en `lib/cms`                                                        |
| SEO multilenguaje                | Hreflang y slugs planificados antes de mucho contenido indexado (V1)                               |

---

## 11. Definición de “MVP listo” (técnico)

- Todas las rutas MVP de la tabla sección 4 responden 200 o 404 apropiado.
- Datos de partidos, tabla, plantilla y noticias consumibles desde las capas de datos/CMS definidas.
- CTAs de entradas y tienda funcionan como enlaces externos configurables.
- Sitemap y metadatos base publicados; búsqueda simple operativa sobre el subconjunto acordado.

---

## Referencia

Fuente única de verdad estructural: `platzi-fc-requerimiento.md` en la raíz del workspace.
