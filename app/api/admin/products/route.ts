import { requireAdmin } from '@/lib/auth/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET() {
  const auth = await requireAdmin()
  if (!auth) {
    return Response.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  try {
    const supabase = await createAdminClient()
    const { data: products, error } = await supabase
      .from('products')
      .select(
        `
        *,
        product_categories (
          id,
          name,
          slug
        )
        `
      )
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[admin/products] fetch error:', error)
      return Response.json({ error: 'Failed to fetch products.' }, { status: 500 })
    }

    return Response.json({ products: products ?? [] })
  } catch (err) {
    console.error('[admin/products] unexpected error:', err)
    return Response.json({ error: 'Unexpected error.' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const auth = await requireAdmin()
  if (!auth) {
    return Response.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const {
      category_id,
      name,
      slug,
      short_description,
      description,
      price,
      compare_at_price,
      rental_available,
      rental_price_daily,
      rental_price_weekly,
      rental_price_monthly,
      rental_deposit,
      stripe_product_id,
      stripe_price_id,
      images,
      specifications,
      stock_quantity,
      is_active,
      is_featured,
    } = body

    if (!name || !name.trim()) {
      return Response.json({ error: 'Product name is required.' }, { status: 400 })
    }
    if (!slug || !slug.trim()) {
      return Response.json({ error: 'Product slug is required.' }, { status: 400 })
    }

    const supabase = await createAdminClient()
    const { data: product, error } = await supabase
      .from('products')
      .insert({
        category_id: category_id ?? null,
        name: name.trim(),
        slug: slug.trim().toLowerCase(),
        short_description: short_description ?? null,
        description: description ?? null,
        price: price != null ? Number(price) : null,
        compare_at_price: compare_at_price != null ? Number(compare_at_price) : null,
        rental_available: rental_available ?? false,
        rental_price_daily: rental_price_daily != null ? Number(rental_price_daily) : null,
        rental_price_weekly: rental_price_weekly != null ? Number(rental_price_weekly) : null,
        rental_price_monthly: rental_price_monthly != null ? Number(rental_price_monthly) : null,
        rental_deposit: rental_deposit != null ? Number(rental_deposit) : null,
        stripe_product_id: stripe_product_id ?? null,
        stripe_price_id: stripe_price_id ?? null,
        images: images ?? [],
        specifications: specifications ?? {},
        stock_quantity: stock_quantity != null ? Number(stock_quantity) : 0,
        is_active: is_active ?? true,
        is_featured: is_featured ?? false,
      })
      .select()
      .single()

    if (error) {
      console.error('[admin/products] insert error:', error)
      if (error.code === '23505') {
        return Response.json({ error: 'A product with that slug already exists.' }, { status: 409 })
      }
      return Response.json({ error: 'Failed to create product.' }, { status: 500 })
    }

    return Response.json({ product }, { status: 201 })
  } catch (err) {
    console.error('[admin/products] unexpected error:', err)
    return Response.json({ error: 'Unexpected error.' }, { status: 500 })
  }
}
