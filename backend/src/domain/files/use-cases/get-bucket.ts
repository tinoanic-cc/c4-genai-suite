import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { BucketEntity, BucketRepository } from 'src/domain/database';
import { Bucket } from '../interfaces';
import { buildBucket } from './utils';

export class GetBucket {
  constructor(public readonly bucketId: number) {}
}

export class GetBucketResponse {
  constructor(public readonly bucket: Bucket) {}
}

@QueryHandler(GetBucket)
export class GetBucketHandler implements IQueryHandler<GetBucket, GetBucketResponse> {
  constructor(
    @InjectRepository(BucketEntity)
    private readonly buckets: BucketRepository,
  ) {}

  async execute(query: GetBucket): Promise<GetBucketResponse> {
    const { bucketId } = query;

    const entity = await this.buckets.findOneBy({ id: bucketId });
    if (!entity) {
      throw new NotFoundException(`Bucket with id '${bucketId}' was not found`);
    }

    const result = buildBucket(entity);
    return new GetBucketResponse(result);
  }
}
