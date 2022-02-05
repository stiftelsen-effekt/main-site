import S from '@sanity/desk-tool/structure-builder'

export default () =>
  S.list()
    .title('Base')
    .items([
      S.listItem()
        .title('About us page')
        .child(
          S.document()
            .schemaType('about_us')
            .documentId('about_us')
        ),
      S.listItem()
        .title('Organizations page')
        .child(
          S.document()
            .schemaType('organizations')
            .documentId('organizations')
        ),
      ...S.documentTypeListItems().filter(listItem => 
        !['about_us'].includes(listItem.getId()) &&
        !['organizations'].includes(listItem.getId()))
    ])