export default {
  location: {
    address: {
      openbare_ruimte: 'Plantage Middenlaan',
      huisnummer: '48',
      huisletter: '',
      huisnummer_toevoeging: '',
      postcode: '1018DH',
      woonplaats: 'Amsterdam'
    },
    buurt_code: 'A08d',
    stadsdeel: 'A',
    geometrie: {
      type: 'Point',
      coordinates: [
        4.913291931152344,
        52.36582256756977
      ]
    }
  },
//   0(pin): "geluidsoverlast-installaties"
// 1(pin): "geluidsoverlast-muziek"
// 2(pin): "overig-horecabedrijven"
// 3(pin): "overlast-door-bezoekers-niet-op-terras"
// 4(pin): "overlast-terrassen"
// 5(pin): "stankoverlast"
  category: 'overlast-bedrijven-en-horeca',
  subcategory: 'stankoverlast',
  subcategory_link: 'https://api.data.amsterdam.nl/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/overig-horecabedrijven',
  description: 'stankoverlast',

  handling_message: 'ingevulde default',

  phone: '020654321',
  email: 'a@b.com',

  datetime: {
    id: 'Nu',
    label: 'Nu'
  }
};
