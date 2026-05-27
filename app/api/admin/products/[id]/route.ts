import type { NextRequest } from 'next/server'
import { requireAdmin } from '@/lib/auth/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin()
  if (!auth) {
    return Response.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const { id } = await params

  try {
    const supabase = await createAdminClient()
    const { data: product, error } = await supabase
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
      .eq('id', id)
      .single()

    if (error || !product) {
      return Response.json({ error: 'Product not found.' }, { status: 404 })
    }

    return Response.json({ product })
  } catch (err) {
    console.error('[admin/products/[id]] GET error:', err)
    return Response.json({ error: 'Unexpected error.' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin()
  if (!auth) {
    return Response.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const { id } = await params

  try {
    const body = await request.json()

    // Build update object only with provided fields
    const updateData: Record<string, unknown> = {}
    const allowedFields = [
      'category_id',
      'name',
      'slug',
      'short_description',
      'description',
      'price',
      'compare_at_price',
      'rental_available',
      'rental_price_daily',
      'rental_price_weekly',
      'rental_price_monthly',
      'rental_deposit',
      'stripe_product_id',
      'stripe_price_id',
      'images',
      'specifications',
      'stock_quantity',
      'is_active',
      'is_featured',
    ]

    for (const field of allowedFields) {
      if (field in body) {
        updateData[field] = body[field]
      }
    }

    if (Object.keys(updateData).length === 0) {
      return Response.json({ error: 'No valid fields to update.' }, { status: 400 })
    }

    if (updateData.slug && typeof updateData.slug === 'string') {
      updateData.slug = updateData.slug.trim().toLowerCase()
    }

    const supabase = await createAdminClient()
    const { data: product, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('[admin/products/[id]] PATCH error:', error)
      if (error.code === '23505') {
        return Response.json({ error: 'A product with that slug already exists.' }, { status: 409 })
      }
      if (error.code === 'PGRST116') {
        return Response.json({ error: 'Product not found.' }, { status: 404 })
      }
      return Response.json({ error: 'Failed to update product.' }, { status: 500 })
    }

    return Response.json({ product })
  } catch (err) {
    console.error('[admin/products/[id]] PATCH error:', err)
    return Response.json({ error: 'Unexpected error.' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin()
  if (!auth) {
    return Response.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const { id } = await params

  try {
    const supabase = await createAdminClient()

    // Soft delete by setting is_active = false
    const { error } = await supabase.from('products').update({ is_active: false }).eq('id', id)

    if (error) {
      console.error('[admin/products/[id]] DELETE error:', error)
      return Response.json({ error: 'Failed to delete product.' }, { status: 500 })
    }

    return Response.json({ success: true })
  } catch (err) {
    console.error('[admin/products/[id]] DELETE error:', err)
    return Response.json({ error: 'Unexpected error.' }, { status: 500 })
  }
}
