export class SlidingWindowLogOptions {
  constructor(
    public windowSize: number,
    public maxRequests: number,
  ) {}
}