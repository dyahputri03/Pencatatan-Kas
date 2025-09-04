import React from "react";
import { ListLayout } from "layouts";
import { mockDB } from "services/mockDB";
import { formatIDR, formatISODate } from "utilities/formatters";
import { Link } from "react-router-dom";

export const PenerimaanBiayaList = () => {
  const [rows, setRows] = React.useState([]);
  const [q, setQ] = React.useState({ unit: "", date_from: "", date_to: "" });

  const reload = React.useCallback(() => {
    // backfill status DRAFT jika seed lama belum punya status
    const data = (mockDB.getPenerimaanBiayaList?.() || []).map(r => ({
      ...r,
      status: r.status || "DRAFT",
    }));
    setRows(data);
  }, []);

  React.useEffect(() => { reload(); }, [reload]);

  const onDelete = (id) => {
    if (confirm("Hapus transaksi DRAFT ini?")) {
      mockDB.deletePenerimaanBiaya(id);
      reload();
    }
  };
  const onApprove = (id) => { mockDB.approvePenerimaanBiaya(id); reload(); };
  const onPost = (id) => {
    try { mockDB.postPenerimaanBiaya(id); reload(); }
    catch (e) { alert(e.message); }
  };

  const filtered = rows.filter(r =>
    (!q.unit || r.unit === q.unit) &&
    (!q.date_from || r.tanggal >= q.date_from) &&
    (!q.date_to || r.tanggal <= q.date_to)
  );

  const total = filtered.reduce((s, r) => s + Number(r.grand_total || 0), 0);
  const units = Array.from(new Set(rows.map(r => r.unit))).sort();

  const StatusBadge = ({ status }) => {
    const map = {
      DRAFT: "secondary",
      APPROVED: "info",
      POSTED: "success",
    };
    return <span className={`badge text-bg-${map[status] || "secondary"}`}>{status}</span>;
  };

  const RowActions = ({ row }) => {
    const st = row.status || "DRAFT";
    if (st === "DRAFT") {
      return (
        <div className="btn-group btn-group-sm">
          <button className="btn btn-outline-danger" onClick={() => onDelete(row.id)}>Hapus</button>
          <button className="btn btn-outline-secondary" onClick={() => onApprove(row.id)}>Setujui</button>
        </div>
      );
    }
    if (st === "APPROVED") {
      return (
        <div className="btn-group btn-group-sm">
          <button className="btn btn-outline-success" onClick={() => onPost(row.id)}>Posting Jurnal</button>
        </div>
      );
    }
    return <span className="text-muted">—</span>; // POSTED: tidak ada aksi
  };

  return (
    <ListLayout
      title="Penerimaan"
      header={
        <div className="d-flex gap-2 align-items-end flex-wrap">
          <Link to="/transaksi/penerimaan-biaya/create" className="btn btn-primary">Tambah</Link>
          {/* Muat Ulang dihilangkan: reload terjadi otomatis setelah aksi */}

          <div className="ms-auto d-flex gap-2">
            <div>
              <label className="form-label mb-1">Unit</label>
              <select className="form-select" value={q.unit} onChange={e => setQ(v => ({ ...v, unit: e.target.value }))}>
                <option value="">Semua</option>
                {units.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label mb-1">Dari</label>
              <input type="date" className="form-control" value={q.date_from} onChange={e => setQ(v => ({ ...v, date_from: e.target.value }))} />
            </div>
            <div>
              <label className="form-label mb-1">Sampai</label>
              <input type="date" className="form-control" value={q.date_to} onChange={e => setQ(v => ({ ...v, date_to: e.target.value }))} />
            </div>
            <button className="btn btn-outline-dark align-self-end" onClick={() => setQ({ unit: "", date_from: "", date_to: "" })}>
              Reset Filter
            </button>
          </div>
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
              <th>Status</th>
              <th className="text-end">Total</th>
              <th>Keterangan</th>
              <th className="text-center" style={{ width: 220 }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={8} className="text-center text-muted py-4">Belum ada data</td></tr>
            ) : filtered.map(r => (
              <tr key={r.id}>
                <td><span className="badge bg-secondary">{r.nomor}</span></td>
                <td>{formatISODate(r.tanggal)}</td>
                <td>{r.jenis_biaya_nama}</td>
                <td>{r.unit}</td>
                <td><StatusBadge status={r.status} /></td>
                <td className="text-end fw-semibold">{formatIDR(r.grand_total)}</td>
                <td className="text-truncate" style={{ maxWidth: 260 }} title={r.keterangan}>{r.keterangan}</td>
                <td className="text-center"><RowActions row={r} /></td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={5} className="text-end fw-bold">Total</td>
              <td className="text-end fw-bold">{formatIDR(total)}</td>
              <td colSpan={2}></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </ListLayout>
  );
};
