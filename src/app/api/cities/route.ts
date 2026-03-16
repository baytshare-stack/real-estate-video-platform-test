// src/app/api/cities/route.ts
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const country = searchParams.get("country");

  const res = await fetch(
    `https://wft-geo-db.p.rapidapi.com/v1/geo/countries/${country}/cities?limit=100`,
    {
      headers: {
        "X-RapidAPI-Key": process.env.RAPID_API_KEY!,
        "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com"
      }
    }
  );

  const data = await res.json();
  const cities = data.data.map((c: any) => c.name);
  return NextResponse.json(cities);
}