import { Quotation } from "../../globalTypes.js";
import { fetchCollection, fetchDocument } from "../firestore";
import { firestore, setDocument } from "../index";

export const quotationsRef = firestore.collection("quotations");

export const getQuotationId = (): string => quotationsRef.doc().id;

export const fetchQuotation = async (
  quotationId: string
): Promise<Quotation | undefined> =>
  fetchDocument<Quotation>(quotationsRef.doc(quotationId));

export const addQuotation = async (
  quotation: Quotation
): Promise<FirebaseFirestore.WriteResult> =>
  setDocument<Quotation>(quotationsRef.doc(quotation.id), quotation);

export const fetchQuotations = async (): Promise<Quotation[] | undefined> =>
  fetchCollection(quotationsRef.where("isDeleted", "==", false));

export const updateQuotation = (
  quotationId: string,
  quotation: Partial<Quotation>
) => quotationsRef.doc(quotationId).update(quotation);
