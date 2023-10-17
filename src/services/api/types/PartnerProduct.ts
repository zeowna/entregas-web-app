import { Entity } from '@/services/api/types/Entity';
import { ProductCategory } from '@/services/api/types/ProductCategory';
import { Partner } from '@/services/api/types/Partner';

export enum PartnerProductStatuses {
  Active = 'active',
  Inactive = 'inactive',
}


export interface PartnerProduct extends Entity {
  partner: Partner;
  value: number;
  status: PartnerProductStatuses;
  product: {
    name: string;
    category: ProductCategory;
    size: string;
    pictureURI: string;
  }
}
