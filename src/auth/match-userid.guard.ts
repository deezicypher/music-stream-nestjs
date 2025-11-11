import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Request } from "express";
import { Observable } from "rxjs";

@Injectable()
export class MatchUserIdGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<Request>();
        const user = request.user;
        const userIdFromQuery = Number(request.query.id)

        if(!user){
            throw new ForbiddenException("User not authenticated")
        }

        if(!userIdFromQuery) {
            throw new ForbiddenException("No user id provided in query")
        }

        if(user !== userIdFromQuery){
            throw new ForbiddenException("You're not authorized to access this resource")
        }
         return true

    }
}