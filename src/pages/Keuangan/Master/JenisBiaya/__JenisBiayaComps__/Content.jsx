import React from "react";

export default function Content({ initialData, onSubmit, submitting }) {
  const [form, setForm] = React.useState({
    nama: initialData?.nama || "",
    keterangan: initialData?.keterangan || "",
  });

  React.useEffect(() => {
    setForm({
      nama: initialData?.nama || "",
      keterangan: initialData?.keterangan || "",
    });
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nama) return alert("Nama wajib diisi");
    onSubmit({ ...form });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Nama</label>
          <input
            className="form-control"
            value={form.nama}
            onChange={(e) => setForm({ ...form, nama: e.target.value })}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Keterangan</label>
          <textarea
            className="form-control"
            rows={3}
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
