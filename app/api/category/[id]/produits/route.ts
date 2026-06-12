import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    return NextResponse.json({
      data: id,
    });
  } catch (error) {
    return NextResponse.json(
      { message: error },
      { status: 500 }
    );
  }
}