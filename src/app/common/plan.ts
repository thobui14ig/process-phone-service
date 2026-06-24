import { SUBSCRIPTION_PLANS_MASTER } from './constant';

export function getPlan(
  planId: number,
  userId: number | null = null,
): { id: number; price: number; maxLinks: number } {
  const base = SUBSCRIPTION_PLANS_MASTER[`VIP_${planId}`];

  const res = structuredClone(base);
  // if (userId == 4) {
  //   res.maxLinks = 450;
  // }

  return res;
}
