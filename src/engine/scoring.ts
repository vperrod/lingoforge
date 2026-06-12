export const XP_PER_CORRECT = 10
export const LESSON_COMPLETE_BONUS = 20
/** Combo multiplier steps: 3+ streak ×1.5, 5+ streak ×2 (rounded) */
export function xpForAnswer(comboCount: number): number {
  if (comboCount >= 5) return XP_PER_CORRECT * 2
  if (comboCount >= 3) return Math.round(XP_PER_CORRECT * 1.5)
  return XP_PER_CORRECT
}
