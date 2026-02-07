import { Body, Controller, Get, Patch, Req, UseGuards } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { JwtAuthGuard } from "../auth/jwt.guard";

@Controller("application")
@UseGuards(JwtAuthGuard)
export class ApplicationController {
  constructor(private prisma: PrismaService) {}

  @Get("me")
  async myApplication(@Req() req: any) {
    const userId = req.user.sub;
    return this.prisma.application.findUnique({ where: { userId } });
  }

  @Patch("me")
  async updateMyApplication(
    @Req() req: any,
    @Body() body: { fullName?: string; institution?: string; essay?: string }
  ) {
    const userId = req.user.sub;
    return this.prisma.application.update({
      where: { userId },
      data: {
        fullName: body.fullName,
        institution: body.institution,
        essay: body.essay,
      },
    });
  }
}
