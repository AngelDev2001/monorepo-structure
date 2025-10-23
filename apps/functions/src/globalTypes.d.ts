export type Timestamp = FirebaseFirestore.Timestamp;

type OmitDefaultFirestoreProps<T> = Omit<T, keyof PickDefaultFirestoreProps>;

type PickDefaultFirestoreProps = Pick<
  DefaultFirestoreProps,
  "createAt" | "isDeleted" | "updateAt"
>;

interface DefaultFirestoreProps {
  createAt: Timestamp;
  updateAt: Timestamp;
  updateBy: string;
  isDeleted: boolean;
}

export type RoleCode = "super_admin" | "user";
export type CurrencyCode = "PEN" | "USD";

export interface _Image {
  createAt: Timestamp;
  name: string;
  status?: string;
  thumbUrl: string;
  uid: string;
  url: string;
}

export type Image = Omit<_Image, "createAt"> & { createAt: Date };

export interface Archive {
  name: string;
  status?: string;
  uid: string;
  url: string;
}

interface Phone {
  prefix: string;
  number: string;
}

interface User extends DefaultFirestoreProps {
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
  profilePhoto?: string;
  birthDate?: string;
  gender?: "male" | "female" | "other";
}

interface Quotation {
  id: string;
  client: {
    firstName?: string;
    paternalSurname?: string;
    maternalSurname?: string;
    companyName?: string;
    document: {
      type: string;
      number: string;
    };
    phone: Phone;
  };
  device: {
    type: string;
    brand: string;
    model: string;
    color: string;
  };
  analysis: string;
  solutions: string;
  recommendations: string;
  serieNumber: string;
}
