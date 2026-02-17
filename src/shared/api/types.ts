import type { Database } from './supabase.types';

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];

export type Enums<T extends keyof Database['public']['Enums']> =
  Database['public']['Enums'][T];

export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];

export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];

// ===== Case Conversion Helpers =====

export type SnakeToCamelCase<S extends string> = S extends `${infer T}_${infer U}`
  ? `${T}${Capitalize<SnakeToCamelCase<U>>}`
  : S;

export type Camelize<T> = T extends (infer U)[]
  ? Array<Camelize<U>>
  : T extends object
  ? { [K in keyof T as SnakeToCamelCase<string & K>]: Camelize<T[K]> }
  : T;

// 조인된 테이블 등을 위한 복합 타입을 정의할 때 사용되는 유틸리티 (필요 시 확장)
export type CompositeRow<T> = T;
