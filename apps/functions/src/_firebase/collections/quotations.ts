import { firestore, setDocument, updateDocument } from '../index';
import { fetchCollection, fetchDocument } from '../firestore';
import { Quotation } from '../../globalTypes';
import { query, where } from 'firebase-admin/firestore';

export const quotationsRef = firestore.collection('quotations');

export const getQuotationId = (): string => quotationsRef.doc().id;

export const fetchQuotation = async (quotationId: string): Promise<Quotation | undefined> =>
  fetchDocument<Quotation>(quotationsRef.doc(quotationId));

export const addQuotation = async (quotation: Quotation): Promise<FirebaseFirestore.WriteResult> =>
  setDocument<Quotation>(quotationsRef.doc(quotation.id), quotation);

export const fetchQuotations = async (): Promise<Quotation[] | undefined> =>
  fetchCollection(query(quotationsRef, where('isDeleted', '==', false)));

export const updateQuotation = async (
  quotationId: string,
  quotation: Partial<Quotation>
): Promise<FirebaseFirestore.WriteResult> =>
  updateDocument<Partial<Quotation>>(quotationsRef.doc(quotationId), quotation);
