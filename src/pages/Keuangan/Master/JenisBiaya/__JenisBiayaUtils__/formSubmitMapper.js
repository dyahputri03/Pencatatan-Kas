export const formSubmitMapper = (values) => ({
  nama: values.nama,
  keterangan: values.keterangan || null,
});
