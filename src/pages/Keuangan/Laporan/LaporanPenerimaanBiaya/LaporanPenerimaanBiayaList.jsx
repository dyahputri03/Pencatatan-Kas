import React from "react";
import { ListLayout } from "layouts";
import { mockDB } from "services/mockDB";
import { formatIDR, formatISODate } from "utilities/formatters";

export const LaporanPenerimaanBiayaList = () => {
  const [q, setQ] = React.useState({ unit:"", date_from:"", date_to:"" });
  const [rows, setRows] = React.useState([]);
  const reload = () => setRows(mockDB.getLaporanPenerimaanBiaya(q));
  React.useEffect(()=>{ reload(); }, []);

  const units = Array.from(new Set(mockDB.getPenerimaanBiayaList().map(r=>r.unit))).sort();
  const total = rows.reduce((s,r)=> s + Number(r.grand_total||0), 0);

  return (
    <ListLayout
      title="Laporan"
      header={
        <div className="d-flex gap-2 align-items-end flex-wrap">
          <div>
            <label className="form-label mb-1">Unit</label>
            <select className="form-select" value={q.unit} onChange={e=>setQ(v=>({...v, unit:e.target.value}))}>
              <option value="">Semua</option>
              {units.map(u=><option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <div>
            <label className="form-label mb-1">Dari</label>
            <input type="date" className="form-control" value={q.date_from} onChange={e=>setQ(v=>({...v, date_from:e.target.value}))}/>
          </div>
          <div>
            <label className="form-label mb-1">Sampai</label>
            <input type="date" className="form-control" value={q.date_to} onChange={e=>setQ(v=>({...v, date_to:e.target.value}))}/>
          </div>
          <button className="btn btn-outline-dark" onClick={reload}>Terapkan</button>
          <a className="btn btn-outline-secondary" href={mockDB.fakeExportLink()} target="_blank" rel="noreferrer">Ekspor</a>
        </div>
      }
    >
      <div className="table-responsive">
        <table className="table table-striped align-middle">
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
            {rows.length===0 ? (
              <tr><td colSpan={6} className="text-center text-muted py-4">Tidak ada data</td></tr>
            ) : rows.map(r => (
              <tr key={r.id}>
                <td><span className="badge bg-secondary">{r.nomor}</span></td>
                <td>{formatISODate(r.tanggal)}</td>
                <td>{r.jenis_biaya_nama}</td>
                <td>{r.unit}</td>
                <td className="text-end">{formatIDR(r.grand_total)}</td>
                <td className="text-truncate" style={{maxWidth:280}} title={r.keterangan}>{r.keterangan}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={4} className="text-end fw-bold">Total</td>
              <td className="text-end fw-bold">{formatIDR(total)}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </ListLayout>
  );
};
