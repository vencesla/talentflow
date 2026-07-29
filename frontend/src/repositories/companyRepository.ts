import api from "@/api/axios";
import type { companyType, updateCompanyType } from "@/schemas/company.schema";

export const companyRepository = {
  async createCompany(payload: companyType): Promise<companyType> {
    const sanitized = sanitizePayload(payload);
    const response = await api.post("/companies", sanitized);
    return response.data;
  },

  async getCompany(): Promise<companyType> {
    const res = await api.get("/companies/me");
    return res.data;
  },

  async updateCompany(payload: updateCompanyType): Promise<companyType> {
    const sanitized = sanitizePayload(payload);

    const response = await api.put("/companies/me", sanitized);
    return response.data;
  },
};

function sanitizePayload(payload: Record<string, any>) {
  const clean: Record<string, any> = {};

  for (const [key, value] of Object.entries(payload)) {
    // On ne garde que ce qui contient une vraie valeur
    if (value !== "" && value !== null && value !== undefined) {
      clean[key] = value;
    }
  }

  return clean;
}
