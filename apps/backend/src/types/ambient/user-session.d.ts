declare type UserSession = {
  createdAt: Date;
  email: string;
  externalId: string;
  familyName?: string;
  givenName?: string;
  id: string;
  permissions: {
    createdAt: Date;
    description?: string;
    id: string;
    name: string;
    updatedAt: Date;
  }[];
  roles: {
    createdAt: Date;
    description?: string;
    id: string;
    name: string;
    updatedAt: Date;
  }[];
  updatedAt: Date;
};
