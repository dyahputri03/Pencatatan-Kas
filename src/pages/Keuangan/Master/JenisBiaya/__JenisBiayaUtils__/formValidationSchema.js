import * as Yup from "yup";

export const formValidationSchema = Yup.object().shape({
  nama: Yup.string().required("Nama wajib diisi"),
  keterangan: Yup.string().nullable(),
});
