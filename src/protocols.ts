export type ApplicationError = {
  name: string;
  message: string;
};

export type ViaCEPAddress = {
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
};

//Regra de Negócio
export type AddressEnrollment = {
  logradouro: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
  error?: string;
};

export type RequestError = {
  status: number;
  data: object | null;
  statusText: string;
  name: string;
  message: string;
};

export type PaymentProcess = {
  ticketId: number;
  cardData: {
    issuer: CardIssuer;
    number: number;
    name: string;
    expirationDate: Date;
    cvv: number;
  };
};

export enum CardIssuer {
  MASTERCARD = "MASTERCARD",
  VISA = "VISA",
}

export enum CardDigits {
  LastDigits = -4,
}
