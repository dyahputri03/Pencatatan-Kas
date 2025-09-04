import React from "react";
import { ContentLayout } from "layouts";
import { mockDB } from "services/mockDB";
import { parseNumber, formatIDR } from "utilities/formatters";
import { useNavigate } from "react-router-dom";

export const PenerimaanBiayaCreate = () => {
  const navigate = useNavigate();
  const jenisOptions = mockDB.getJenisBiaya();
  const [form, setForm] = React.useState({
    tanggal: new Date().toISOString().slice(0,10),
    jenis_biaya_id: jenisOptions[0]?.id || 1,
    unit: "Kantor Pusat",
    dpp: 0, ppn: 0, pph23: 0, grand_total: 0,
    keterangan: "",
  });

  const recalc = (obj) => {
    const dpp = parseNumber(obj.dpp);
    const ppn = parseNumber(obj.ppn);
    const pph23 = parseNumber(obj.pph23);
    const grand_total = dpp + ppn - pph23;
    return { ...obj, dpp, ppn, pph23, grand_total };
  };

  const onChange = (key, val) => setForm(v => recalc({ ...v, [key]: val }));

  const onSubmit = (e) => {
    e.preventDefault();
    if (!form.tanggal) return alert("Tanggal wajib diisi");
    if (form.grand_total <= 0) return alert("Total harus > 0");
    mockDB.createPenerimaanBiaya(form);
    navigate("/transaksi/penerimaan-biaya");
  };

  return (
    <ContentLayout title="Tambah Penerimaan">
      <form onSubmit={onSubmit} className="row g-3">
        <div className="col-md-3">
          <label className="form-label">Tanggal</label>
          <input type="date" className="form-control" value={form.tanggal} onChange={e=>onChange("tanggal", e.target.value)} />
        </div>
        <div className="col-md-4">
          <label className="form-label">Jenis</label>
          <select className="form-select" value={form.jenis_biaya_id} onChange={e=>onChange("jenis_biaya_id", Number(e.target.value))}>
            {jenisOptions.map(j => <option key={j.id} value={j.id}>{j.nama}</option>)}
          </select>
        </div>
        <div className="col-md-5">
          <label className="form-label">Unit</label>
          <input className="form-control" value={form.unit} onChange={e=>onChange("unit", e.target.value)} />
        </div>

        <div className="col-md-4">
          <label className="form-label">DPP</label>
          <input className="form-control" inputMode="numeric" value={form.dpp} onChange={e=>onChange("dpp", e.target.value)} />
        </div>
        <div className="col-md-4">
          <label className="form-label">PPN</label>
          <input className="form-control" inputMode="numeric" value={form.ppn} onChange={e=>onChange("ppn", e.target.value)} />
        </div>
        <div className="col-md-4">
          <label className="form-label">PPh 23</label>
          <input className="form-control" inputMode="numeric" value={form.pph23} onChange={e=>onChange("pph23", e.target.value)} />
        </div>

        <div className="col-12">
          <label className="form-label">Keterangan</label>
          <textarea className="form-control" rows={3} value={form.keterangan} onChange={e=>onChange("keterangan", e.target.value)} />
        </div>

        <div className="col-12">
          <div className="alert alert-info d-flex justify-content-between">
            <div><strong>Total:</strong> {formatIDR(form.grand_total)}</div>
            <div className="d-flex gap-2">
              <button type="button" className="btn btn-outline-secondary" onClick={()=>setForm(v=>recalc({...v, ppn: Math.round(parseNumber(v.dpp)*0.11)}))}>Hitung PPN 11%</button>
              <button type="button" className="btn btn-outline-secondary" onClick={()=>setForm(v=>recalc({...v, pph23: Math.round(parseNumber(v.dpp)*0.02)}))}>Hitung PPh 23 (2%)</button>
            </div>
          </div>
        </div>

        <div className="col-12 d-flex gap-2">
          <button className="btn btn-primary" type="submit">Simpan</button>
          <button className="btn btn-outline-secondary" type="button" onClick={()=>setForm({
            tanggal: new Date().toISOString().slice(0,10),
            jenis_biaya_id: jenisOptions[0]?.id || 1,
            unit: "Kantor Pusat", dpp:0, ppn:0, pph23:0, grand_total:0, keterangan:""
          })}>Simpan & Buat Baru</button>
        </div>
      </form>
    </ContentLayout>
  );
};
