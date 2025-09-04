export const penerimaanBiayaValidation = (v) => {
    const e = {};
    if (!v.tanggal) e.tanggal = "Wajib diisi";
    if (!v.jenisBiaya) e.jenisBiaya = "Pilih jenis";
    if (!v.total || v.total <= 0) e.total = "Total > 0";
    return e;
};