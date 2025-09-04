import React from "react";
import { ListLayout, ContentLayout } from "layouts";
import ContentForm from "./__JenisBiayaComps__/Content.jsx";
import { jenisBiayaApi } from "./__JenisBiayaApi__/JenisBiayaApi";

export const JenisBiayaList = () => {
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [edit, setEdit] = React.useState(null);

  const reload = React.useCallback(async () => {
    setLoading(true);
    try {
      const list = await jenisBiayaApi.getList();
      setRows(list || []);
    } catch (e) {
      console.error(e);
      alert(e?.message || "Gagal memuat data Jenis Biaya");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    reload();
  }, [reload]);

  const onDelete = async (id) => {
    if (!confirm("Yakin hapus data ini?")) return;
    await jenisBiayaApi.delete(id);
    reload();
  };

  const onSubmit = async (payload) => {
    if (edit?.id) await jenisBiayaApi.update(edit.id, payload);
    else await jenisBiayaApi.create(payload);
    setEdit(null);
    reload();
  };

  return (
    <div className="container my-3">
      <ListLayout
        title="Pengaturan Jenis Biaya"
        header={<button className="btn btn-primary" onClick={() => setEdit({})}>Tambah</button>}
      >
        {loading ? <div>Loading...</div> : (
          <table className="table table-bordered">
            <thead>
              <tr><th>ID</th><th>Nama</th><th>Keterangan</th><th style={{width:160}}>Aksi</th></tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.nama}</td>
                  <td>{r.keterangan}</td>
                  <td className="d-flex gap-2">
                    <button className="btn btn-sm btn-warning" onClick={() => setEdit(r)}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => onDelete(r.id)}>Hapus</button>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && <tr><td colSpan={4} className="text-center text-muted">Belum ada data</td></tr>}
            </tbody>
          </table>
        )}
      </ListLayout>

      {edit && (
        <ContentLayout title={edit?.id ? "Edit Jenis Biaya" : "Tambah Jenis Biaya"}>
          <ContentForm initialData={edit} submitting={false} onSubmit={onSubmit} />
          <div className="text-end">
            <button className="btn btn-secondary mt-2" onClick={() => setEdit(null)}>Batal</button>
          </div>
        </ContentLayout>
      )}
    </div>
  );
};
