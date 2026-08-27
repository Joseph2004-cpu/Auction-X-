describe('Auction State Machine & Transitions', () => {
  const validTransitions: Record<string, string[]> = {
    DRAFT: ['PENDING_REVIEW', 'CANCELLED'],
    PENDING_REVIEW: ['SCHEDULED', 'CANCELLED', 'REJECTED'],
    SCHEDULED: ['ACTIVE', 'CANCELLED'],
    ACTIVE: ['ENDED', 'CANCELLED', 'SUSPENDED'],
    ENDED: ['SETTLED', 'DISPUTED'],
    SETTLED: [],
    CANCELLED: [],
  };

  function canTransition(current: string, next: string): boolean {
    const allowed = validTransitions[current] || [];
    return allowed.includes(next);
  }

  it('should allow DRAFT -> PENDING_REVIEW transition', () => {
    expect(canTransition('DRAFT', 'PENDING_REVIEW')).toBe(true);
  });

  it('should allow SCHEDULED -> ACTIVE transition', () => {
    expect(canTransition('SCHEDULED', 'ACTIVE')).toBe(true);
  });

  it('should allow ACTIVE -> ENDED transition', () => {
    expect(canTransition('ACTIVE', 'ENDED')).toBe(true);
  });

  it('should prevent invalid DRAFT -> ENDED transition', () => {
    expect(canTransition('DRAFT', 'ENDED')).toBe(false);
  });

  it('should prevent invalid ENDED -> ACTIVE transition', () => {
    expect(canTransition('ENDED', 'ACTIVE')).toBe(false);
  });
});
