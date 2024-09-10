import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const posts = await prisma.post.findMany();

  return NextResponse.json({
    data: posts,
  });
}

export async function POST(request: NextRequest) {
  // const { title, content } = await request.json();

  const post = await prisma.post.create({
    data: {
      title: 'title',
      content: 'content',
      Author: {
        connect: {
          id: 'cm0dwq8rg0001tsc44av58c7r',
        },
      },
    },
  });

  return NextResponse.json({
    data: post,
  });
}
