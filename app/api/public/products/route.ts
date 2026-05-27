import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    const supabase = await createClient()

    let query = supabase
      .from('products')
      .select(
        `
        id,
        name,
        slug,
        short_description,
        price,
        compare_at_price,
        rental_available,
        rental_price_daily,
        rental_price_weekly,
        rental_price_monthly,
        rental_deposit,
        images,
        is_featured,
        stock_quantity,
        category_id,
        product_categories (
          id,
          name,
          slug
        )
        `
      )
      .eq('is_active', true)
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false })

    if (category) {
      // Support filtering by category slug or id
      const { data: cat } = await supabase
        .from('product_categories')
        .select('id')
        .eq('slug', category)
        .single()

      if (cat) {
        query = query.eq('category_id', cat.id)
      }
    }

    const { data: products, error } = await query

    if (error) {
      console.error('[public/products] fetch error:', error)
      return Response.json({ error: 'Failed to fetch products.' }, { status: 500 })
    }

    return Response.json({ products: products ?? [] })
  } catch (err) {
    console.error('[public/products] unexpected error:', err)
    return Response.json({ error: 'Unexpected error.' }, { status: 500 })
  }
}
