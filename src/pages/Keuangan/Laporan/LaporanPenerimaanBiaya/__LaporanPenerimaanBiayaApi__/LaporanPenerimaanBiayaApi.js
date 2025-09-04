import { Services } from "services";

export class LaporanPenerimaanBiayaApi {
  async getList(params) {
    const res = await Services.get("/laporan/penerimaan-biaya", { params });
    return res?.data?.data || [];
  }
  async getExport(params) {
    const res = await Services.get("/laporan/penerimaan-biaya/export", { params });
    return res?.data?.data?.link || null;
  }
}
export const laporanPenerimaanBiayaApi = new LaporanPenerimaanBiayaApi();
