import { mockDB } from "services/mockDB";

export class PenerimaanBiayaApi {
  async getList() {
    return mockDB.getPenerimaanBiayaList();
  }
  async getSingle(id) {
    return mockDB.getPenerimaanBiaya(id);
  }
  async create(data) {
    return mockDB.createPenerimaanBiaya(data);
  }
  async delete(id) {
    return mockDB.deletePenerimaanBiaya(id);
  }
  async getDropdownJenisBiaya() {
    return mockDB.dropdownJenisBiaya();
  }
}
export const penerimaanBiayaApi = new PenerimaanBiayaApi();
