import { User, UserRole } from "@prisma/client";

export function requireContributorOrAdmin(user: User) {
  if (user.role !== UserRole.admin && user.role !== UserRole.contributor) {
    throw new Error("Unauthorized");
  }
}

export function requireAdmin(user: User) {
  if (user.role !== UserRole.admin) {
    throw new Error("Unauthorized");
  }
}

export function requirePending(user: User) {
  if (user.role !== UserRole.pending) {
    throw new Error("Unauthorized");
  }
}

export function requireUserRole(user: User) {
  if (user.role !== UserRole.user) {
    throw new Error("Unauthorized");
  }
}

export function isContributorOrAdmin(user: User) {
  return user.role === UserRole.admin || user.role === UserRole.contributor;
}

export function isAdmin(user: User) {
  return user.role === UserRole.admin;
}

export function isPending(user: User) {
  return user.role === UserRole.pending;
}

export function isUser(user: User) {
  return user.role === UserRole.user;
}
