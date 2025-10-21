import assert from "assert";

import { Response, Request, NextFunction } from "express";
import { isEmpty } from "lodash";

import { auth, fetchCollection, fetchDocument, firestore } from "../../../_firebase";
import { User } from "../../../globalTypes";
import { defaultFirestoreProps } from "../../../utils";

type Params = { userId: string };

const { assignUpdateProps } = defaultFirestoreProps();

export const putUser = async (
  req: Request<Params, unknown, User, unknown>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const {
    body: user,
    params: { userId },
  } = req;

  console.log(userId, "「Update user」Initialize", {
    params: req.params,
    body: req.body,
  });

  try {
    const userFirestore = await fetchUser(user.id);
    const changeEmail = userFirestore.email !== user.email;
    const changePhoneNumber = userFirestore.phone.number !== user.phone.number;

    if (changeEmail) {
      const emailExists = await isEmailExists(user.email);
      if (emailExists) {
        res.status(412).send("user/email_already_exists").end();
        return;
      }
    }

    if (changePhoneNumber) {
      const phoneNumberExists = await isPhoneNumberExists(user.phone.number);
      if (phoneNumberExists) {
        res.status(412).send("user/phone_number_already_exists").end();
        return;
      }
    }

    await updateUser(assignUpdateProps(user));
    await updateUserAuth(user, changeEmail, changePhoneNumber);

    res.sendStatus(200).end();
  } catch (e) {
    console.error(e);
  }
};

const updateUser = async (user: User): Promise<void> => {
  await firestore
    .collection("users")
    .doc(user.id)
    .update({ ...user });
};

const updateUserAuth = async (
  user: User,
  changeEmail: boolean,
  changePhoneNumber: boolean
): Promise<void> => {
  await auth.updateUser(user.id, {
    ...(changeEmail && { email: user?.email || undefined }),
    ...(changePhoneNumber && {
      phoneNumber: user?.phone ? `${user.phone?.prefix || "+51"}${user.phone.number}` : undefined,
    }),
  });
};

const isEmailExists = async (email: string | null): Promise<boolean> => {
  const users = await fetchCollection<User>(
    firestore.collection("users").where("isDeleted", "==", false).where("email", "==", email)
  );

  return !isEmpty(users);
};

const isPhoneNumberExists = async (phoneNumber: string | null): Promise<boolean> => {
  const users = await fetchCollection<User>(
    firestore
      .collection("users")
      .where("isDeleted", "==", false)
      .where("phone.number", "==", phoneNumber)
  );

  return !isEmpty(users);
};

const fetchUser = async (userId: string): Promise<User> => {
  const user = await fetchDocument<User>(firestore.collection("users").doc(userId));

  assert(user, `User doesn't exist: ${userId}`);

  return user;
};
