import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";

import { PrismaService } from "./prisma/prisma.service";

import { AuthController } from "./auth/auth.controller";
import { AuthService } from "./auth/auth.service";

import { ApplicationController } from "./application/application.controller";

import { PaymentController } from "./payment/payment.controller";
import { PaymentService } from "./payment/payment.service";

import { AdminController } from "./admin/admin.controller";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "7d" },
    }),
  ],
  controllers: [
    AuthController,
    ApplicationController,
    PaymentController,
    AdminController
  ],
  providers: [
    PrismaService,
    AuthService,
    PaymentService
  ],
})
export class AppModule {}
