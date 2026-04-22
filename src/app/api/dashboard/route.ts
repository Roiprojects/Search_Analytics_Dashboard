import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Fetch all settings
    const { data: settings, error: settingsError } = await supabase
      .from('search_dashboard_settings')
      .select('*')
      .order('id', { ascending: true })
      .limit(1)
      .single();

    if (settingsError && settingsError.code !== 'PGRST116') {
      throw settingsError;
    }

    // Fetch locations
    const { data: locations, error: locationsError } = await supabase
      .from('search_dashboard_locations')
      .select('name, searches')
      .order('id', { ascending: true });

    if (locationsError) throw locationsError;

    return NextResponse.json({
      keyword: settings?.keyword || "Enter Keyword",
      report_label: settings?.report_label || "SEO Marketing Report",
      main_title: settings?.main_title || "Search Analytics",
      sub_title: settings?.sub_title || "Analyzing local search volume distribution for primary keywords.",
      keyword_label: settings?.keyword_label || "Targeted Keyword",
      searches_label: settings?.searches_label || "Total Google Searches",
      locations_label: settings?.locations_label || "Active Locations",
      breakdown_title: settings?.breakdown_title || "Location Breakdown",
      footer_text: settings?.footer_text || "Search Analytics Dashboard",
      license_text: settings?.license_text || "Standard License",
      locations: locations || []
    });
  } catch (error) {
    console.error("Error fetching from Supabase:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { locations, ...settings } = body;

    // 1. Update or Insert settings (using id 1 for singleton record)
    const { error: settingsError } = await supabase
      .from('search_dashboard_settings')
      .upsert({ id: 1, ...settings });

    if (settingsError) throw settingsError;

    // 2. Synchronize locations
    const { error: deleteError } = await supabase
      .from('search_dashboard_locations')
      .delete()
      .not('id', 'is', null);

    if (deleteError) throw deleteError;

    if (locations && locations.length > 0) {
      const { error: insertError } = await supabase
        .from('search_dashboard_locations')
        .insert(locations.map((l: any) => ({ name: l.name, searches: l.searches })));

      if (insertError) throw insertError;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving to Supabase:", error);
    return NextResponse.json({ error: "Failed to save data" }, { status: 500 });
  }
}
