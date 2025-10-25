declare type TokenPayload = {
  aud?: string | string[];
  azp?: string;
  exp?: number;
  iat?: number;
  iss?: string;
  scope?: string;
  sub: string;
};
