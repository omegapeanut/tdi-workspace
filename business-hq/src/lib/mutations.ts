import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import type { ActivityAction, AuditFields } from "../types";

type NewEntity<T extends AuditFields> = Omit<T, "id" | keyof AuditFields>;

function auditOnCreate(actorId: string): AuditFields {
  const now = Date.now();
  return { createdBy: actorId, updatedBy: actorId, createdAt: now, updatedAt: now, status: "active" };
}

function auditOnUpdate(actorId: string): Pick<AuditFields, "updatedBy" | "updatedAt"> {
  return { updatedBy: actorId, updatedAt: Date.now() };
}

export async function createEntity<T extends AuditFields>(
  collectionName: string,
  data: NewEntity<T>,
  actorId: string,
): Promise<string> {
  const ref = await addDoc(collection(db, collectionName), { ...data, ...auditOnCreate(actorId) });
  return ref.id;
}

export async function updateEntity<T extends AuditFields>(
  collectionName: string,
  id: string,
  patch: Partial<Omit<T, "id">>,
  actorId: string,
): Promise<void> {
  await updateDoc(doc(db, collectionName, id), { ...patch, ...auditOnUpdate(actorId) });
}

export async function softDeleteEntity(collectionName: string, id: string, actorId: string): Promise<void> {
  await updateDoc(doc(db, collectionName, id), { status: "deleted", ...auditOnUpdate(actorId) });
}

export async function logActivity(
  entityType: "task" | "project" | "milestone" | "goal",
  entityId: string,
  actorId: string,
  action: ActivityAction,
  detail: string,
): Promise<void> {
  await addDoc(collection(db, "hqActivity"), {
    entityType,
    entityId,
    actorId,
    action,
    detail,
    ...auditOnCreate(actorId),
  });
}
