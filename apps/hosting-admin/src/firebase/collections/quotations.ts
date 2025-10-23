import { firestore } from "../index";
import {
  fetchCollection,
  fetchDocument,
  setDocument,
  updateDocument,
  type WhereClauses,
} from "../firestore";
import type { Quotation } from "../../globalTypes";

export const quotationsRef = firestore.collection("quotations");
export const getQuotationId = (): string => quotationsRef.doc().id;

export const fetchQuotations = async (
  whereClauses?: WhereClauses<Quotation>[]
): Promise<Quotation[]> =>
  fetchCollection<Quotation>(quotationsRef, whereClauses);

export const fetchQuotation = async (
  quotationId: string
): Promise<Quotation | undefined> =>
  fetchDocument<Quotation>(quotationsRef.doc(quotationId));

export const addQuotation = async (
  quotation: Partial<Quotation>
): Promise<void> =>
  setDocument<Partial<Quotation>>(quotationsRef.doc(quotation.id), quotation);

export const updateQuotation = async (
  quotationId: string,
  quotation: Partial<Quotation>
): Promise<void> =>
  updateDocument<Partial<Quotation>>(quotationsRef.doc(quotationId), quotation);

export const deleteQuotation = async (
  quotationId: string,
  quotation: Partial<Quotation>
): Promise<void> =>
  updateDocument<Partial<Quotation>>(quotationsRef.doc(quotationId), quotation);
