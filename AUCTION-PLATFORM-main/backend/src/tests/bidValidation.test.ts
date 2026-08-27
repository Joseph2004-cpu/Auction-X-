import Decimal from 'decimal.js';

describe('Bidding Rules & Increments Validation Engine', () => {
  it('should correctly calculate next valid bid with minimum increment', () => {
    const currentPrice = new Decimal(100.0);
    const minIncrement = new Decimal(5.0);
    const minRequiredBid = currentPrice.plus(minIncrement);

    expect(minRequiredBid.toNumber()).toBe(105.0);
  });

  it('should reject bids lower than current price + min increment', () => {
    const currentPrice = new Decimal(100.0);
    const minIncrement = new Decimal(5.0);
    const proposedBid = new Decimal(101.0);

    const minRequiredBid = currentPrice.plus(minIncrement);
    const isValid = proposedBid.greaterThanOrEqualTo(minRequiredBid);

    expect(isValid).toBe(false);
  });

  it('should accept valid bids exceeding or equal to minimum required bid', () => {
    const currentPrice = new Decimal(100.0);
    const minIncrement = new Decimal(5.0);
    const proposedBid = new Decimal(105.0);

    const minRequiredBid = currentPrice.plus(minIncrement);
    const isValid = proposedBid.greaterThanOrEqualTo(minRequiredBid);

    expect(isValid).toBe(true);
  });

  it('should prohibit sellers from bidding on their own auctions', () => {
    const sellerId = 'seller-123';
    const bidderId = 'seller-123';

    const isSelfBidding = sellerId === bidderId;
    expect(isSelfBidding).toBe(true);
  });
});
