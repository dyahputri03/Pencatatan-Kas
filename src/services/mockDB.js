const KEY = "keuangan_mockdb_v2";

const seed = {
  jenisBiaya: [
    { id: 1, nama: "Pendapatan Jasa", keterangan: "Pembayaran dari klien" },
    { id: 2, nama: "Dana Hibah", keterangan: "Hibah/donasi" },
    { id: 3, nama: "Pengembalian Pinjaman Karyawan", keterangan: "Pengembalian uang muka/pinjaman" },
  ],
  penerimaanBiaya: [
    { id: 1, nomor: "RCV/2025/09/0001", tanggal: "2025-09-01", jenis_biaya_id: 2, jenis_biaya_nama: "Dana Hibah", unit: "Fakultas Teknologi", dpp: 50000000, ppn: 0, pph23: 0, grand_total: 50000000, keterangan: "Dana hibah riset AI" },
    { id: 2, nomor: "RCV/2025/09/0002", tanggal: "2025-09-03", jenis_biaya_id: 1, jenis_biaya_nama: "Pendapatan Jasa", unit: "Kantor Pusat", dpp: 10000000, ppn: 0, pph23: 0, grand_total: 10000000, keterangan: "Pembayaran proyek analisis data" },
    { id: 3, nomor: "RCV/2025/09/0003", tanggal: "2025-09-05", jenis_biaya_id: 3, jenis_biaya_nama: "Pengembalian Pinjaman Karyawan", unit: "HR", dpp: 1000000, ppn: 0, pph23: 0, grand_total: 1000000, keterangan: "Pengembalian uang muka" },
    { id: 4, nomor: "RCV/2025/09/0004", tanggal: "2025-09-10", jenis_biaya_id: 1, jenis_biaya_nama: "Pendapatan Jasa", unit: "Divisi Operasional", dpp: 7500000, ppn: 0, pph23: 0, grand_total: 7500000, keterangan: "Pembayaran kontrak maintenance" },
    { id: 5, nomor: "RCV/2025/09/0005", tanggal: "2025-09-12", jenis_biaya_id: 2, jenis_biaya_nama: "Dana Hibah", unit: "Fakultas Teknologi", dpp: 25000000, ppn: 0, pph23: 0, grand_total: 25000000, keterangan: "Donasi alumni FT" },
  ],
  jurnal: [],
  periode: { "2025-09": { locked: false } },
  _seq: 5,
};

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  localStorage.setItem(KEY, JSON.stringify(seed));
  return JSON.parse(JSON.stringify(seed));
}
function save(db) { localStorage.setItem(KEY, JSON.stringify(db)); }

function nomorBaru(tanggal, prefix = "RCV") {
  const d = new Date(tanggal || Date.now());
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const seq = String(Math.floor(Math.random()*9000) + 1000); 
  return `${prefix}/${y}/${m}/${seq}`;
}

export const mockDB = {
  reset() { localStorage.removeItem(KEY); },
  getJenisBiaya() {
    return load().jenisBiaya;
  },
  addJenisBiaya(row) {
    const db = load();
    const id = (db.jenisBiaya.at(-1)?.id || 0) + 1;
    db.jenisBiaya.push({ id, ...row });
    save(db);
    return id;
  },

  getPenerimaanBiayaList() {
    const db = load();
    return db.penerimaanBiaya.sort((a,b)=>a.tanggal.localeCompare(b.tanggal));
  },
  createPenerimaanBiaya(data) {
    const db = load();
    const id = (db.penerimaanBiaya.at(-1)?.id || 0) + 1;
    const nomor = nomorBaru(data.tanggal);
    const item = {
      id, nomor,
      status: "DRAFT",
      tanggal: data.tanggal,
      jenis_biaya_id: data.jenis_biaya_id,
      jenis_biaya_nama: db.jenisBiaya.find(j=>j.id===data.jenis_biaya_id)?.nama || "",
      unit: data.unit || "Kantor Pusat",
      dpp: Number(data.dpp||0),
      ppn: Number(data.ppn||0),
      pph23: Number(data.pph23||0),
      grand_total: Number(data.grand_total || (Number(data.dpp||0)+Number(data.ppn||0)-Number(data.pph23||0))),
      keterangan: data.keterangan || "",
    };
    db.penerimaanBiaya.push(item);
    save(db);
    return item;
  },
  deletePenerimaanBiaya(id) {
    const db = load();
    db.penerimaanBiaya = db.penerimaanBiaya.filter(x=>x.id!==Number(id));
    save(db);
  },
  approvePenerimaanBiaya(id, user="approver") {
    const db = load();
    const trx = db.penerimaanBiaya.find(x=>x.id===Number(id));
    if (!trx) throw new Error("Data tidak ditemukan");
    trx.status = "APPROVED";
    trx.approved_by = user;
    trx.approved_at = new Date().toISOString();
    save(db);
    return trx;
  },
  postPenerimaanBiaya(id, user="poster") {
    const db = load();
    const trx = db.penerimaanBiaya.find(x=>x.id===Number(id));
    if (!trx) throw new Error("Data tidak ditemukan");
    const ym = trx.tanggal.slice(0,7);
    if (db.periode?.[ym]?.locked) throw new Error("Periode terkunci");
    if (trx.status !== "APPROVED" && trx.status !== "POSTED") throw new Error("Harus APPROVED sebelum POSTING");
    if (trx.status === "POSTED") return trx;

    const entries = [
      { akun:"1110", nama:"Kas/Bank", dc:"D", nominal: trx.grand_total },
      { akun:"4100", nama:"Pendapatan Lain-lain", dc:"C", nominal: trx.grand_total },
    ];
    db.jurnal.push({ ref: trx.nomor, tanggal: trx.tanggal, entries });
    trx.status = "POSTED";
    trx.posted_by = user;
    trx.posted_at = new Date().toISOString();
    save(db);
    return trx;
  },

  getLaporanPenerimaanBiaya({ date_from, date_to, unit } = {}) {
    const db = load();
    let rows = [...db.penerimaanBiaya];
    if (date_from) rows = rows.filter((r) => r.tanggal >= date_from);
    if (date_to) rows = rows.filter((r) => r.tanggal <= date_to);
    if (unit) rows = rows.filter((r) => r.unit === unit);
    return rows;
  },

  fakeExportLink() {
    const blob = new Blob(["Laporan Penerimaan Biaya (mock)"], { type: "text/plain" });
    return URL.createObjectURL(blob);
  },

  getAllJenisBiaya() {
    const db = load();
    return [...db.jenisBiaya];
  },
  getJenisBiaya(id) {
    const db = load();
    return db.jenisBiaya.find(x => x.id === Number(id)) || null;
  },
  createJenisBiaya(data) {
    const db = load();
    const id = (db.jenisBiaya.at(-1)?.id || 0) + 1;
    const row = { id, nama: data?.nama || "", keterangan: data?.keterangan || "" };
    db.jenisBiaya.push(row);
    save(db);
    return row;
  },
  updateJenisBiaya(id, data) {
    const db = load();
    const idx = db.jenisBiaya.findIndex(x => x.id === Number(id));
    if (idx === -1) throw new Error("Data tidak ditemukan");
    db.jenisBiaya[idx] = { ...db.jenisBiaya[idx], ...data };
    save(db);
    return db.jenisBiaya[idx];
  },
  deleteJenisBiaya(id) {
    const db = load();
    db.jenisBiaya = db.jenisBiaya.filter(x => x.id !== Number(id));
    save(db);
    return true;
  },
  dropdownJenisBiaya() {
    const db = load();
    return db.jenisBiaya.map(j => ({ value: j.id, label: j.nama }));
  },

  getPenerimaanBiaya(id) {
    const db = load();
    return db.penerimaanBiaya.find(x => x.id === Number(id)) || null;
  },
  deletePenerimaanBiaya(id) {
    const db = load();
    db.penerimaanBiaya = db.penerimaanBiaya.filter(x => x.id !== Number(id));
    save(db);
    return true;
  },
  approvePenerimaanBiaya(id, user = "approver") {
    const db = load();
    const trx = db.penerimaanBiaya.find(x => x.id === Number(id));
    if (!trx) throw new Error("Data tidak ditemukan");
    trx.status = "APPROVED";
    trx.approved_by = user;
    trx.approved_at = new Date().toISOString();
    save(db);
    return trx;
  },
  postPenerimaanBiaya(id, user = "poster") {
    const db = load();
    const trx = db.penerimaanBiaya.find(x => x.id === Number(id));
    if (!trx) throw new Error("Data tidak ditemukan");
    const ym = (trx.tanggal || "").slice(0, 7);
    if (db.periode?.[ym]?.locked) throw new Error("Periode terkunci");
    if (trx.status !== "APPROVED" && trx.status !== "POSTED") throw new Error("Harus APPROVED sebelum POSTING");
    if (trx.status === "POSTED") return trx;

    db.jurnal = db.jurnal || [];
    const entries = [
      { akun: "1110", nama: "Kas/Bank", dc: "D", nominal: Number(trx.grand_total || 0) },
      { akun: "4100", nama: "Pendapatan Lain-lain", dc: "C", nominal: Number(trx.grand_total || 0) },
    ];
    db.jurnal.push({ ref: trx.nomor, tanggal: trx.tanggal, entries });
    trx.status = "POSTED";
    trx.posted_by = user;
    trx.posted_at = new Date().toISOString();
    save(db);
    return trx;
  },
};
