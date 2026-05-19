import type { StructureBuilder } from 'sanity/structure'

export const deskStructure = (S: StructureBuilder) =>
  S.list()
    .title('Platzi FC')
    .items([
      // ─── Deportivo ─────────────────────────────
      S.listItem()
        .title('Deportivo')
        .child(
          S.list()
            .title('Deportivo')
            .items([
              S.documentTypeListItem('season').title('Temporadas'),
              S.documentTypeListItem('competition').title('Competiciones'),
              S.documentTypeListItem('team').title('Equipos'),
              S.documentTypeListItem('match').title('Partidos'),
              S.documentTypeListItem('player').title('Jugadores'),
              S.documentTypeListItem('staff').title('Staff'),
              S.documentTypeListItem('standings').title('Clasificaciones'),
              S.documentTypeListItem('venue').title('Estadios'),
            ]),
        ),

      S.divider(),

      // ─── Editorial ─────────────────────────────
      S.listItem()
        .title('Editorial')
        .child(
          S.list()
            .title('Editorial')
            .items([
              // Noticias con filtros de estado
              S.listItem()
                .title('Noticias')
                .child(
                  S.list()
                    .title('Noticias')
                    .items([
                      S.listItem()
                        .title('Todas las noticias')
                        .child(S.documentTypeList('article').title('Todas las noticias')),
                      S.listItem()
                        .title('Borradores')
                        .child(
                          S.documentTypeList('article')
                            .title('Borradores')
                            .filter('_type == "article" && status == "draft"'),
                        ),
                      S.listItem()
                        .title('Publicadas')
                        .child(
                          S.documentTypeList('article')
                            .title('Publicadas')
                            .filter('_type == "article" && status == "published"'),
                        ),
                      S.listItem()
                        .title('Comunicados oficiales')
                        .child(
                          S.documentTypeList('article')
                            .title('Comunicados')
                            .filter('_type == "article" && official == true'),
                        ),
                    ]),
                ),
              S.documentTypeListItem('video').title('Videos'),
              S.documentTypeListItem('gallery').title('Galerias'),
              S.documentTypeListItem('page').title('Paginas CMS'),
            ]),
        ),

      S.divider(),

      // ─── Comercial ─────────────────────────────
      S.listItem()
        .title('Comercial')
        .child(
          S.list()
            .title('Comercial')
            .items([
              S.documentTypeListItem('ticketProduct').title('Entradas'),
              S.documentTypeListItem('shopProduct').title('Tienda'),
              S.documentTypeListItem('sponsor').title('Sponsors'),
              S.documentTypeListItem('membershipPlan').title('Membresias'),
              S.documentTypeListItem('fanEvent').title('Eventos de Fans'),
            ]),
        ),
    ])
