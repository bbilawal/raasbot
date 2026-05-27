-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE solutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE rentals ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE investor_docs ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Helper function: is the current user admin or editor?
CREATE OR REPLACE FUNCTION is_admin_or_editor()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'editor')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Helper function: is the current user strictly admin?
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ========================================================
-- user_profiles
-- ========================================================
-- Anyone can read their own profile
CREATE POLICY "users_read_own_profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

-- Admins/editors can read all profiles
CREATE POLICY "admins_read_all_profiles"
  ON user_profiles FOR SELECT
  USING (is_admin_or_editor());

-- Users can update their own profile (non-role fields)
CREATE POLICY "users_update_own_profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role = (SELECT role FROM user_profiles WHERE id = auth.uid()));

-- Only admins can update roles
CREATE POLICY "admins_update_any_profile"
  ON user_profiles FOR UPDATE
  USING (is_admin());

-- ========================================================
-- product_categories
-- ========================================================
CREATE POLICY "public_read_active_categories"
  ON product_categories FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "admins_all_categories"
  ON product_categories FOR ALL
  USING (is_admin_or_editor())
  WITH CHECK (is_admin_or_editor());

-- ========================================================
-- products
-- ========================================================
CREATE POLICY "public_read_active_products"
  ON products FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "admins_all_products"
  ON products FOR ALL
  USING (is_admin_or_editor())
  WITH CHECK (is_admin_or_editor());

-- ========================================================
-- solutions
-- ========================================================
CREATE POLICY "public_read_published_solutions"
  ON solutions FOR SELECT
  USING (is_published = TRUE);

CREATE POLICY "admins_all_solutions"
  ON solutions FOR ALL
  USING (is_admin_or_editor())
  WITH CHECK (is_admin_or_editor());

-- ========================================================
-- pages
-- ========================================================
CREATE POLICY "public_read_published_pages"
  ON pages FOR SELECT
  USING (is_published = TRUE);

CREATE POLICY "admins_all_pages"
  ON pages FOR ALL
  USING (is_admin_or_editor())
  WITH CHECK (is_admin_or_editor());

-- ========================================================
-- news_posts
-- ========================================================
CREATE POLICY "public_read_published_news"
  ON news_posts FOR SELECT
  USING (published_at IS NOT NULL AND published_at <= NOW());

CREATE POLICY "admins_all_news"
  ON news_posts FOR ALL
  USING (is_admin_or_editor())
  WITH CHECK (is_admin_or_editor());

-- ========================================================
-- banners
-- ========================================================
CREATE POLICY "public_read_active_banners"
  ON banners FOR SELECT
  USING (
    is_active = TRUE
    AND (starts_at IS NULL OR starts_at <= NOW())
    AND (ends_at IS NULL OR ends_at >= NOW())
  );

CREATE POLICY "admins_all_banners"
  ON banners FOR ALL
  USING (is_admin_or_editor())
  WITH CHECK (is_admin_or_editor());

-- ========================================================
-- media
-- ========================================================
CREATE POLICY "admins_read_media"
  ON media FOR SELECT
  USING (is_admin_or_editor());

CREATE POLICY "admins_insert_media"
  ON media FOR INSERT
  WITH CHECK (is_admin_or_editor());

CREATE POLICY "admins_delete_media"
  ON media FOR DELETE
  USING (is_admin_or_editor());

-- ========================================================
-- milestones
-- ========================================================
CREATE POLICY "public_read_milestones"
  ON milestones FOR SELECT
  USING (TRUE);

CREATE POLICY "admins_all_milestones"
  ON milestones FOR ALL
  USING (is_admin_or_editor())
  WITH CHECK (is_admin_or_editor());

-- ========================================================
-- orders
-- ========================================================
-- Users see their own orders
CREATE POLICY "users_read_own_orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

-- Admins see all orders
CREATE POLICY "admins_read_all_orders"
  ON orders FOR SELECT
  USING (is_admin_or_editor());

-- Orders created via service role (webhook) — no user policy needed for INSERT
-- Admins can update orders
CREATE POLICY "admins_update_orders"
  ON orders FOR UPDATE
  USING (is_admin_or_editor())
  WITH CHECK (is_admin_or_editor());

-- ========================================================
-- order_items
-- ========================================================
CREATE POLICY "users_read_own_order_items"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "admins_all_order_items"
  ON order_items FOR ALL
  USING (is_admin_or_editor())
  WITH CHECK (is_admin_or_editor());

-- ========================================================
-- rentals
-- ========================================================
CREATE POLICY "users_read_own_rentals"
  ON rentals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "admins_read_all_rentals"
  ON rentals FOR SELECT
  USING (is_admin_or_editor());

CREATE POLICY "admins_update_rentals"
  ON rentals FOR UPDATE
  USING (is_admin_or_editor())
  WITH CHECK (is_admin_or_editor());

-- ========================================================
-- quotes
-- ========================================================
-- Public can insert (submit a quote)
CREATE POLICY "public_insert_quotes"
  ON quotes FOR INSERT
  WITH CHECK (TRUE);

-- Admins can read/update quotes
CREATE POLICY "admins_all_quotes"
  ON quotes FOR ALL
  USING (is_admin_or_editor())
  WITH CHECK (is_admin_or_editor());

-- ========================================================
-- contact_messages
-- ========================================================
-- Public can insert (submit a message)
CREATE POLICY "public_insert_contact"
  ON contact_messages FOR INSERT
  WITH CHECK (TRUE);

-- Admins can read/update contact messages
CREATE POLICY "admins_all_contact"
  ON contact_messages FOR ALL
  USING (is_admin_or_editor())
  WITH CHECK (is_admin_or_editor());

-- ========================================================
-- investor_docs
-- ========================================================
CREATE POLICY "public_read_public_investor_docs"
  ON investor_docs FOR SELECT
  USING (is_public = TRUE);

CREATE POLICY "admins_all_investor_docs"
  ON investor_docs FOR ALL
  USING (is_admin_or_editor())
  WITH CHECK (is_admin_or_editor());

-- ========================================================
-- support_downloads
-- ========================================================
CREATE POLICY "public_read_public_downloads"
  ON support_downloads FOR SELECT
  USING (is_public = TRUE);

CREATE POLICY "admins_all_downloads"
  ON support_downloads FOR ALL
  USING (is_admin_or_editor())
  WITH CHECK (is_admin_or_editor());

-- ========================================================
-- site_settings
-- ========================================================
-- Public can read all settings (needed for storefront config)
CREATE POLICY "public_read_settings"
  ON site_settings FOR SELECT
  USING (TRUE);

-- Only admins can write settings
CREATE POLICY "admins_write_settings"
  ON site_settings FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());
