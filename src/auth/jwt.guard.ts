import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwt: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const auth = req.headers.authorization;

    if (!auth?.startsWith("Bearer ")) {
      throw new UnauthorizedException("Missing token");
    }

    try {
      const token = auth.split(" ")[1];
      const payload = this.jwt.verify(token);
      req.user = payload; // { sub, role }
      return true;
    } catch {
      throw new UnauthorizedException("Invalid token");
    }
  }
}
