import { NextResponse } from "next/server";
import {
  hasAdminUsersMongo,
  listAdminUsersOverview,
} from "@/lib/api/admin-users-mongo";
import { roleFromBearerToken } from "@/lib/auth/roles";

export const dynamic = "force-dynamic";

/** Admin-only: overview of all users (Mongo Atlas). */
export async function GET(request: Request) {
  const role = roleFromBearerToken(request.headers.get("authorization"));
  if (!role) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!hasAdminUsersMongo()) {
    return NextResponse.json(
      { error: "MONGO_URL chưa cấu hình để đọc danh sách user" },
      { status: 503 },
    );
  }

  try {
    const users = await listAdminUsersOverview();
    return NextResponse.json({
      users,
      total: users.length,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Lỗi đọc users";
    console.error("[admin/users]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
