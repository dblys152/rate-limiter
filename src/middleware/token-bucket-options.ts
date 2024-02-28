export class TokenBucketOptions {
  constructor(
    public maxTokens: number,
    public refillRate: number,
  ) {}
}