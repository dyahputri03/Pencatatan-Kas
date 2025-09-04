import { mockDB } from "services/mockDB";

export class JenisBiayaApi {
  async getList() { return mockDB.getAllJenisBiaya(); }
  async getSingle(id) { return mockDB.getJenisBiaya(id); }
  async create(data) { return mockDB.createJenisBiaya(data); }
  async update(id, data) { return mockDB.updateJenisBiaya(id, data); }
  async delete(id) { return mockDB.deleteJenisBiaya(id); }
  async getDropdown() { return mockDB.dropdownJenisBiaya(); }
}
export const jenisBiayaApi = new JenisBiayaApi();
