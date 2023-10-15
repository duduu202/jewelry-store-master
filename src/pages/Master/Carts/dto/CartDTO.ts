import { IProductDTO } from "../../Products/dto/ProductDTO";

export interface ICartItemDTO {
    id: string;
    cart_id: string;
    product_id: string;
    quantity: number;
    created_at: string;
    updated_at: string;
    product: IProductDTO;
  }
  
export interface ICartDTO {
    id: string;
    user_id: string;
    cupom_id: string | null;
    status: string;
    paid_status: string;
    address_id: string | null;
    delivery_fee: number;
    expires_at: string;
    created_at: string;
    updated_at: string;
    cupom: any | null;
    cart_items: ICartItemDTO[];
    products_price: number;
    discount: number;
    total_price: number;
  }

export enum Cart_status {
  EM_PROCESSAMENTO = 'EM_PROCESSAMENTO',
  EM_TRANSITO = 'EM_TRANSITO',
  ENTREGUE = 'ENTREGUE',
  EM_TROCA = 'EM_TROCA',
  TROCA_AUTORIZADA = 'TROCA_AUTORIZADA',
  REPROVADA = 'REPROVADA',
  APROVADA = 'APROVADA'
};
  