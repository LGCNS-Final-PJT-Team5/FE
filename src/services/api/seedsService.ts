import api from "../../lib/axios";

class SeedsService {
  async getSeedBalance() {
    const res = await api.get(`/reward/users/balance`);
    // const res = await api.get(`/reward/users/balance`, {
    //   headers: {
    //     'X-User-Id': 18,
    //   },
    // });
    return res.data.data;
  }

  async getSeedHistory(page: number) {
    const res = await api.get(`/reward/users/history`, {
      params: { page, size: 10 },
    });
    // const res = await api.get(`/reward/users/history`, {
    //   params: { page, size: 10 },
    //   headers: {
    //     'X-User-Id': 18,
    //   },
    // });
    return res.data.data;
  }
}

export const seedsService = new SeedsService();