import { Controller, Post, Req, UseGuards, Headers } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt.guard";
import { PaymentService } from "./payment.service";
import { PrismaService } from "../prisma/prisma.service";
import * as crypto from "crypto";

@Controller("payment")
export class PaymentController {
  constructor(
    private payment: PaymentService,
    private prisma: PrismaService
  ) {}

  // Applicant starts payment
  @Post("initiate")
  @UseGuards(JwtAuthGuard)
  async initiate(@Req() req: any) {
    const userId = req.user.sub;
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    return this.payment.initiatePayment(user!.email, userId);
  }

  // Paystack webhook
  @Post("webhook")
  async webhook(@Req() req: any, @Headers("x-paystack-signature") sig: string) {
    const secret = process.env.PAYSTACK_SECRET_KEY || "";

    const hash = crypto
      .createHmac("sha512", secret)
      .update(req.rawBody) // IMPORTANT: rawBody from main.ts
      .digest("hex");

    if (hash !== sig) return { ok: false };

    const event = req.body;

    if (event.event === "charge.success") {
      const reference = event.data.reference;

      const pay = await this.prisma.payment.findUnique({ where: { reference } });
      if (!pay) return { ok: true }; // ignore unknown

      await this.prisma.payment.update({
        where: { reference },
        data: { status: "PAID" },
      });

      // Move application to UNDER_REVIEW
      await this.prisma.application.update({
        where: { userId: pay.userId },
        data: {
          status: "UNDER_REVIEW",
          submittedAt: new Date(),
        },
      });
    }

    return { ok: true };
  }
}
