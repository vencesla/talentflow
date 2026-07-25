import { http } from "@/services/http";
import type {
  ApiUser,
  CreateUserInput,
  UsersListResponse,
} from "@/schemas/user.schema";

export const userApi = {
  async getAll(): Promise<ApiUser[]> {
    const res = await http.get<UsersListResponse>("/users");
    return res.data;
  },

  async create(payload: CreateUserInput): Promise<ApiUser> {
    const res = await http.post<ApiUser>("/user", payload);
    return res.data;
  },

  async update(
    id: number,
    payload: {
      email?: string;
      firstName?: string | null;
      lastName?: string | null;
    },
  ) {
    const res = await http.put<ApiUser>(`/user/${id}`, payload);
    return res.data;
  },

  async remove(id: number) {
    await http.delete(`/user/${id}`);
  },
};
