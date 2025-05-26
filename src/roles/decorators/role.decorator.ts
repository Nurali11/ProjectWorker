import { SetMetadata } from "@nestjs/common";
import {Role} from "../roles.enum";

export const ROLES_KEY  = Role.ADMIN || Role.USER || Role.SUPER_ADMIN || Role.VIEWER_ADMIN
export const RoleD = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);