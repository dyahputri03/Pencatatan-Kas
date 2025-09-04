import React from "react";

export default function Content({ initialData, onSubmit, optionsJenisBiaya, submitting }) {
  const [form, setForm] = React.useState({
    tanggal: initialData?.tanggal || "",
    jenis_biaya_id: initialData?.jenis_biaya_id || "",
    unit: initialData?.unit || "",
    total: initialData?.total || 0,
    keterangan: initialData?.keterangan || "",
  });

  React.useEffect(() => {
    setForm({
      tanggal: initialData?.tanggal || "",
      jenis_biaya_id: initialData?.jenis_biaya_id || "",
      unit: initialData?.unit || "",
      total: initialData?.total || 0,
      keterangan: initialData?.keterangan || "",
    });
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.tanggal) return alert("Tanggal wajib diisi");
    if (!form.jenis_biaya_id) return alert("Jenis biaya wajib dipilih");
    if (!form.unit) return alert("Unit wajib diisi");
    if (!(Number(form.total) > 0)) return alert("Total minimal 1");
    onSubmit({ ...form, total: Number(form.total) });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row g-3">
        <div className="col-md-3">
          <label className="form-label">Tanggal</label>
          <input
            type="date"
            className="form-control"
            value={form.tanggal}
            onChange={(e) => setForm({ ...form, tanggal: e.target.value })}
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Jenis Biaya</label>
          <select
            className="form-select"
            value={form.jenis_biaya_id}
            onChange={(e) => setForm({ ...form, jenis_biaya_id: e.target.value })}
          >
            <option value="">- pilih -</option>
            {optionsJenisBiaya?.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label">Unit</label>
          <input
            className="form-control"
            value={form.unit}
            onChange={(e) => setForm({ ...form, unit: e.target.value })}
          />
        </div>
        <div className="col-md-2">
          <label className="form-label">Total</label>
          <input
            type="number"
            className="form-control"
            value={form.total}
            onChange={(e) => setForm({ ...form, total: e.target.value })}
          />
        </div>
        <div className="col-12">
          <label className="form-label">Keterangan</label>
          <textarea
            className="form-control"
            rows={2}
            value={form.keterangan}
            onChange={(e) => setForm({ ...form, keterangan: e.target.value })}
          />
        </div>
      </div>

      <div className="text-end mt-3">
        <button type="submit" className="btn btn-success" disabled={submitting}>
          {submitting ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </form>
  );
}
