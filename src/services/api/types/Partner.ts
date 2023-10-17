import { Entity } from '@/services/api/types/Entity';
import { Address } from '@/services/api/types/Address';

export interface Partner extends Entity {
  name: string;
  cnpj: string;
  pictureURI?: string;
  address: Address;
}
