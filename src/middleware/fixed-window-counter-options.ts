export class FixedWindowCounterOptions {
  constructor(
    public windowSize: number,
    public maxRequests: number,
  ) {}
}