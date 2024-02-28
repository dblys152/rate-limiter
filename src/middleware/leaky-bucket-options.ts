export class LeakyBucketOptions {
  constructor(
    public bucketSize: number,
    public leakRate: number,
  ) {}
}