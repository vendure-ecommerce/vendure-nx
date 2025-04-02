import { ProductReview } from './entities/product-review.entity';

/**
 * @description
 * The plugin can be configured using the following options:
 */
export interface ExamplePluginInitOptions {
  exampleOption?: string;
}

export type ReviewState = 'new' | 'approved' | 'rejected';

declare module '@vendure/core' {
  interface CustomProductFields {
    reviewCount: number;
    reviewRating: number;
    featuredReview?: ProductReview;
  }
}
