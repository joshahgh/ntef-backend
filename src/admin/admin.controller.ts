import { Controller, Get, Patch, Param, UseGuards } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { JwtAuthGuard } from "../auth/jwt.guard";
import { AdminGuard } from "./admin.guard";

@Controller("admin")
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  constructor(private prisma: PrismaService) {}

  @Get("applications")
  list() {
    return this.prisma.application.findMany({
      include: { user: { select: { email: true, role: true } } },
      orderBy: { submittedAt: "desc" },
    });
  }

  @Patch("application/:id/approve")
  approve(@Param("id") id: string) {
    return this.prisma.application.update({
      where: { id },
      data: { status: "APPROVED" },
    });
  }

  @Patch("application/:id/reject")
  reject(@Param("id") id: string) {
    return this.prisma.application.update({
      where: { id },
      data: { status: "REJECTED" },
    });
  }
}
