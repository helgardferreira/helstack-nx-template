declare type TokenPayload = {
  exp: number;
  iat: number;
  sub: string;
  user: {
    createdAt: number;
    updatedAt: number;
    username: string;
  };
};
