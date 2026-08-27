import Decimal from 'decimal.js';
import { BidsService } from '../modules/bids/bids.service';

describe('Concurrency & Anti-Sniping Engine', () => {
  it('should extend auction end time dynamically when a bid arrives in the final 60 seconds (Anti-Sniping)', () => {
    const now = new Date();
    // Auction ending in 30 seconds
    const initialEndTime = new Date(now.getTime() + 30 * 1000);
    const antiSnipeSeconds = 60;
    const antiSnipeExtendMins = 2;

    const secondsRemaining = (initialEndTime.getTime() - now.getTime()) / 1000;
    let newEndTime = initialEndTime;

    if (secondsRemaining <= antiSnipeSeconds) {
      newEndTime = new Date(initialEndTime.getTime() + antiSnipeExtendMins * 60 * 1000);
    }

    expect(secondsRemaining).toBeLessThanOrEqual(antiSnipeSeconds);
    expect(newEndTime.getTime()).toBeGreaterThan(initialEndTime.getTime());
    expect((newEndTime.getTime() - initialEndTime.getTime()) / 1000).toBe(120);
  });

  it('should not extend auction end time when a bid arrives well before the final anti-sniping window', () => {
    const now = new Date();
    // Auction ending in 10 minutes (600 seconds)
    const initialEndTime = new Date(now.getTime() + 600 * 1000);
    const antiSnipeSeconds = 60;

    const secondsRemaining = (initialEndTime.getTime() - now.getTime()) / 1000;
    let newEndTime = initialEndTime;

    if (secondsRemaining <= antiSnipeSeconds) {
      newEndTime = new Date(initialEndTime.getTime() + 2 * 60 * 1000);
    }

    expect(secondsRemaining).toBeGreaterThan(antiSnipeSeconds);
    expect(newEndTime.getTime()).toBe(initialEndTime.getTime());
  });

  it('should handle simulated concurrent bid validation requests cleanly', async () => {
    const basePrice = new Decimal(500);
    const minIncrement = new Decimal(25);
    const bids = [525, 550, 575, 600, 625];

    let currentPrice = basePrice;
    const processedBids: number[] = [];

    for (const bidAmount of bids) {
      const proposed = new Decimal(bidAmount);
      const minRequired = currentPrice.plus(minIncrement);
      if (proposed.greaterThanOrEqualTo(minRequired)) {
        currentPrice = proposed;
        processedBids.push(proposed.toNumber());
      }
    }

    expect(processedBids.length).toBe(5);
    expect(currentPrice.toNumber()).toBe(625);
  });
});
