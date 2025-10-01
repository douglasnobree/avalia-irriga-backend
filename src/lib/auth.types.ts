import { auth } from './auth';
import type { Propriedade, Organization, Member } from '@prisma/client';

// Inferência de tipos do Better Auth
export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.User;
export type AuthOrganization = typeof auth.$Infer.Organization;

// Tipos estendidos para incluir relacionamentos do Prisma
export interface OrganizationWithProperties extends AuthOrganization {
  propriedades?: Property[];
  members?: Member[];
}

export interface Property {
  id: string;
  nome: string;
  proprietario: string;
  telefone: string;
  email: string;
  municipio: string;
  estado: string;
  latitude: number;
  longitude: number;
  area_total: number;
  area_irrigada: number;
  observacoes: string;
  userId: string;
  organizationId: string;
}

export interface MemberWithOrganization extends Member {
  organization: OrganizationWithProperties;
}

export interface SessionWithOrganization extends Session {
  activeOrganizationId?: string;
}

// Tipos do Prisma re-exportados para facilitar o uso
export type { Propriedade, Organization, Member } from '@prisma/client';
