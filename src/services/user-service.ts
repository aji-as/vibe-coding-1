import { eq } from "drizzle-orm";
import { db } from "../db";
import { users, session } from "../db/schema";

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export async function register(payload: RegisterPayload) {
  // Cek apakah email sudah terdaftar
  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, payload.email))
    .limit(1);

  if (existing.length > 0) {
    throw new Error("email sudah terdaftar");
  }

  // Hash password menggunakan Bun built-in bcrypt
  const hashedPassword = await Bun.password.hash(payload.password, {
    algorithm: "bcrypt",
    cost: 10,
  });

  // Simpan user baru ke database
  await db.insert(users).values({
    name: payload.name,
    email: payload.email,
    password: hashedPassword,
  });

  return { data: "OK" };
}

export async function login(payload: RegisterPayload) {
  // Cari user berdasarkan email
  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, payload.email))
    .limit(1);

  if (user.length === 0) {
    throw new Error("email atau password salah");
  }

  // Verifikasi password
  const isPasswordValid = await Bun.password.verify(
    payload.password,
    user[0].password
  );

  if (!isPasswordValid) {
    throw new Error("email atau password salah");
  }

  // Generate token UUID
  const token = crypto.randomUUID();

  // Simpan sesi ke database
  await db.insert(session).values({
    token: token,
    userId: user[0].id,
  });

  return { data: token };
}
