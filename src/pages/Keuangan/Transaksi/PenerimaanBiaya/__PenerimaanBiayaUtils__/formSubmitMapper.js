export const penerimaanBiayaSubmitMapper = (v) => ({
    tanggal: v.tanggal,
    master_jenis_biaya_id: v.jenisBiaya?.value,
    total: Number(v.total || 0),
    unit: v.unit?.label,
    keterangan: v.keterangan
});