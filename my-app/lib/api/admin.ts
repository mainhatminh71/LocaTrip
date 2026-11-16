import { apiFetch, apiErrorFromBody, ApiError } from "@/lib/api/http";
import type { AdminUserRow } from "@/lib/api/admin-users-mongo";

export type { AdminUserRow };

export async function getAdminUsers(): Promise<{
  users: AdminUserRow[];
  total: number;
}> {
  const res = await apiFetch("/api/admin/users/", {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  const data = (await res.json().catch(() => ({}))) as {
    users?: AdminUserRow[];
    total?: number;
    error?: string;
  };
  if (!res.ok) {
    throw apiErrorFromBody(data, res.status, "Không tải được danh sách user");
  }
  return {
    users: Array.isArray(data.users) ? data.users : [],
    total: Number(data.total) || 0,
  };
}

export { ApiError };
