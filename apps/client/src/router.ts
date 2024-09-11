// Generouted, changes to this file will be overriden
/* eslint-disable */

import { components, hooks, utils } from "@generouted/react-router/client";

export type Path =
  | `/`
  | `/dashboard`
  | `/dashboard/help`
  | `/dashboard/records`
  | `/dashboard/records/:recordId`
  | `/dashboard/records/:recordId/deliver`
  | `/dashboard/records/:recordId/events`
  | `/dashboard/records/:recordId/events/:eventId`
  | `/dashboard/settings`
  | `/dashboard/users`
  | `/dashboard/users/:userId`
  | `/forbidden`
  | `/forget-password`
  | `/login`
  | `/register`
  | `/reset-password`
  | `/sr/:recordId`;

export type Params = {
  "/dashboard/records/:recordId": { recordId: string };
  "/dashboard/records/:recordId/deliver": { recordId: string };
  "/dashboard/records/:recordId/events": { recordId: string };
  "/dashboard/records/:recordId/events/:eventId": {
    recordId: string;
    eventId: string;
  };
  "/dashboard/users/:userId": { userId: string };
  "/sr/:recordId": { recordId: string };
};

export type ModalPath = never;

export const { Link, Navigate } = components<Path, Params>();
export const { useModals, useNavigate, useParams } = hooks<
  Path,
  Params,
  ModalPath
>();
export const { redirect } = utils<Path, Params>();
