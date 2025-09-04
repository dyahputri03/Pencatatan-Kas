import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Dashboard from "pages/Dashboard.jsx"; 

import { JenisBiayaList } from "pages/Keuangan/Master/JenisBiaya/JenisBiayaList.jsx";
import { PenerimaanBiayaCreate } from "pages/Keuangan/Transaksi/PenerimaanBiaya/PenerimaanBiayaCreate.jsx";
import { PenerimaanBiayaList } from "pages/Keuangan/Transaksi/PenerimaanBiaya/PenerimaanBiayaList.jsx";
import { LaporanPenerimaanBiayaList } from "pages/Keuangan/Laporan/LaporanPenerimaanBiaya/LaporanPenerimaanBiayaList.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <nav className="navbar navbar-expand bg-light border-bottom">
        <div className="container-fluid gap-3">
          <Link className="navbar-brand fw-semibold" to="/">Pencatatan Kas</Link>
          <div className="d-flex gap-3">
            <Link to="/transaksi/penerimaan-biaya">Penerimaan</Link>
            <Link to="/laporan/penerimaan-biaya">Laporan</Link>
            <Link to="/pengaturan/jenis-biaya">Pengaturan</Link>
          </div>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Dashboard />} />

        <Route path="/pengaturan/jenis-biaya" element={<JenisBiayaList />} />
        <Route path="/transaksi/penerimaan-biaya" element={<PenerimaanBiayaList />} />
        <Route path="/transaksi/penerimaan-biaya/create" element={<PenerimaanBiayaCreate />} />
        <Route path="/laporan/penerimaan-biaya" element={<LaporanPenerimaanBiayaList />} />
        <Route path="*" element={<div className="container py-3">Halaman tidak ditemukan</div>} />
      </Routes>
    </BrowserRouter>
  );
}
