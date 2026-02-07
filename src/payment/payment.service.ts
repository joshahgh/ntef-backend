import axios from "axios";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  async initiatePayment(email: string, userId: string) {
    const res = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: 100000, // Paystack amount is in kobo => 1000 NGN
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reference = res.data.data.reference;
    const authorization_url = res.data.data.authorization_url;

    await this.prisma.payment.create({
      data: {
        userId,
        reference,
        amount: 1000,
        status: "PENDING",
      },
    });

    return { authorization_url, reference };
  }
}
