import type { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { hash } from "bcrypt";
import { randomUUID } from "node:crypto";
import type { PrismaService } from "../database/prisma.service.js";

export async function createAuthenticatedUser(
    app: INestApplication,
    prisma: PrismaService
) {
    const email = `e2e-auth-${randomUUID()}@example.com`;
    const user = await prisma.user.create({
        data: {
            name: "E2E Auth User",
            email,
            passwordHash: await hash("password123", 4)
        }
    });
    const accessToken = await app.get(JwtService).signAsync({
        sub: user.id,
        email: user.email
    });

    return { user, accessToken };
}
