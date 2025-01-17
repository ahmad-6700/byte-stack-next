import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  const supabase = createClient();
  
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error) {
    console.log(error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ user });
}
