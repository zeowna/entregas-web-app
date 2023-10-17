import { Entity } from '@/services/api/types/Entity';
import { PartnerProduct } from '@/services/api/types/PartnerProduct';

export interface CartProduct extends Entity {
  quantity: number;
  value: number;
  partnerProduct: PartnerProduct;
}
