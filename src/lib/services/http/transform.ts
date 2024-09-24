import { ErrorAbstract } from '@/lib/errorts';
import { NextResponse } from 'next/server';

export function transformResponse<T extends any>(
  data: T | T[],
  meta: {
    total?: number;
    page?: number;
    limit?: number;
  } = {
    total: 1,
    page: 1,
    limit: 1,
  },
  error?: ErrorAbstract,
) {
  const transformed = {
    data: Array.isArray(data) ? data : [data],
    message: error?.errorMessage,
    meta: {
      ...meta,
      total: Array.isArray(data) ? data.length : meta.total,
    },
  };

  return NextResponse.json(transformed, {
    status: error ? error.status : 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
