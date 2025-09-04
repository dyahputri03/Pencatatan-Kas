import React from "react";
import { Link } from "react-router-dom";
import { mockDB } from "services/mockDB";
import { formatIDR, formatISODate } from "utilities/formatters";

export default function Dashboard() {
  const rows = mockDB.getPenerimaanBiayaList?.() || [];
  const now = new Date();
  const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const rowsThisMonth = rows.filter(r => (r.tanggal || "").startsWith(ym));
  const totalAll = rows.reduce((s, r) => s + Number(r.grand_total || 0), 0);
  const totalThisMonth = rowsThisMonth.reduce((s, r) => s + Number(r.grand_total || 0), 0);
  const last5 = [...rows].sort((a, b) => (b.tanggal || "").localeCompare(a.tanggal || "")).slice(0, 5);

  return (
    <div className="container py-3">
      <div className="d-flex align-items-center mb-3">
        <h1 className="h4 m-0">Dashboard</h1>
        <div className="ms-auto d-flex gap-2">
          <Link to="/transaksi/penerimaan-biaya/create" className="btn btn-primary">+ Tambah Penerimaan</Link>
          <Link to="/laporan/penerimaan-biaya" className="btn btn-outline-secondary">Lihat Laporan</Link>
        </div>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-md-6">
          <div className="card shadow-sm position-relative">
            <div className="card-body">
              <div className="text-muted small">Total Penerimaan (Semua)</div>
              <div className="fs-4 fw-semibold">{formatIDR(totalAll)}</div>
              <Link to="/transaksi/penerimaan-biaya" className="stretched-link" aria-label="Lihat Penerimaan"></Link>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm position-relative">
            <div className="card-body">
              <div className="text-muted small">Total Penerimaan (Bulan ini)</div>
              <div className="fs-4 fw-semibold">{formatIDR(totalThisMonth)}</div>
              <div className="mt-2"><span className="badge text-bg-light">{rowsThisMonth.length} transaksi</span></div>
              <Link to="/laporan/penerimaan-biaya" className="stretched-link" aria-label="Lihat Laporan"></Link>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-md-4">
          <div className="card h-100 shadow-sm position-relative">
            <div className="card-header"><strong>Penerimaan</strong></div>
            <div className="card-body">
              <p className="mb-2">
                Menu untuk mencatat <em>kas masuk</em> (pembayaran klien, hibah/donasi, pengembalian uang muka).
              </p>
              <ul className="small mb-0">
                <li>Input DPP/PPN/PPh 23, unit, keterangan.</li>
                <li>Alur: <code>DRAFT → APPROVED → POSTED</code> (posting = jurnal).</li>
                <li>Filter daftar berdasarkan <strong>Unit</strong> &amp; tanggal.</li>
              </ul>
              <Link to="/transaksi/penerimaan-biaya" className="stretched-link" aria-label="Buka Penerimaan"></Link>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100 shadow-sm position-relative">
            <div className="card-header"><strong>Laporan</strong></div>
            <div className="card-body">
              <p className="mb-2">Rekap penerimaan untuk analisis &amp; pelaporan.</p>
              <ul className="small mb-0">
                <li>Filter berdasarkan <strong>Unit</strong> &amp; tanggal.</li>
                <li>Lihat total &amp; detail transaksi.</li>
                <li>Ekspor (mock) untuk unduhan cepat.</li>
              </ul>
              <Link to="/laporan/penerimaan-biaya" className="stretched-link" aria-label="Buka Laporan"></Link>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100 shadow-sm position-relative">
            <div className="card-header"><strong>Pengaturan</strong></div>
            <div className="card-body">
              <p className="mb-2">Kelola <em>master data</em> yang dipakai transaksi.</p>
              <ul className="small mb-0">
                <li><strong>Jenis Biaya</strong>: daftar kategori (Pendapatan Jasa, Dana Hibah, dsb).</li>
                <li>Dipakai saat input Penerimaan.</li>
              </ul>
              <Link to="/pengaturan/jenis-biaya" className="stretched-link" aria-label="Buka Pengaturan"></Link>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-header d-flex align-items-center">
          <strong>Penerimaan Terbaru</strong>
          <div className="ms-auto">
            <Link to="/transaksi/penerimaan-biaya" className="btn btn-sm btn-outline-secondary">Lihat Semua</Link>
          </div>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-striped align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Nomor</th>
                  <th>Tanggal</th>
                  <th>Jenis</th>
                  <th>Unit</th>
                  <th className="text-end">Total</th>
                  <th>Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {last5.length === 0 ? (
                  <tr><td colSpan={6} className="text-center text-muted py-4">Belum ada transaksi</td></tr>
                ) : last5.map(r => (
                  <tr key={r.id}>
                    <td><span className="badge bg-secondary">{r.nomor}</span></td>
                    <td>{formatISODate(r.tanggal)}</td>
                    <td>{r.jenis_biaya_nama}</td>
                    <td>{r.unit}</td>
                    <td className="text-end">{formatIDR(r.grand_total)}</td>
                    <td className="text-truncate" style={{maxWidth: 280}} title={r.keterangan}>{r.keterangan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}
