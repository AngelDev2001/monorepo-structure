interface DefaultFirestoreProps {
  createAt: string;
  updateAt: string;
  deleteAt?: string;
  isDeleted?: boolean;
}

export interface IdentityDocument {
  type: "DNI" | "RUC" | "CE";
  number: string;
}

interface Phone {
  prefix: string;
  number: string;
}

export interface User {
  id: string;
  firstName: string;
  paternalSurname: string;
  maternalSurname: string;
  email: string;
  document: IdentityDocument;
  phone: Phone;
  gender: "male" | "female" | "other";
}

export interface UserRegister {
  firstName: string;
  paternalSurname: string;
  maternalSurname: string;
  email: string;
  document: {
    type: "DNI" | "RUC" | "CE";
    number: string;
  };
  phone: Phone;
  gender: "male" | "female" | "other";
}
