interface DefaultFirestoreProps {
  createAt: string;
  updateAt: string;
  deleteAt?: string;
  isDeleted?: boolean;
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
  document: {
    type: "DNI" | "RUC" | "CE";
    number: string;
  };
  phone: Phone;
  gender: "male" | "female" | "other";
}

export interface UpdateUser extends Partial<User> {}
