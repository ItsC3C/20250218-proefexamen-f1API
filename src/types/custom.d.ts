// src/types/custom.d.ts
declare namespace Express {
  interface Request {
    user?: { userId: string }; // Het type dat je toevoegt (bijv. userId)
  }
}
