-- Seed: product categories
INSERT INTO product_categories (name, slug, description, display_order, is_active) VALUES
  ('Humanoid', 'humanoid', 'Advanced humanoid robots designed for complex interactions and tasks in human environments.', 1, TRUE),
  ('AI Education', 'ai-education', 'Intelligent educational robots and platforms for STEM learning and skills development.', 2, TRUE),
  ('Commercial', 'commercial', 'High-performance commercial robots optimized for business environments and operations.', 3, TRUE),
  ('Healthcare', 'healthcare', 'Precision robots engineered for healthcare settings including assistance, logistics, and monitoring.', 4, TRUE),
  ('Logistics', 'logistics', 'Autonomous logistics robots for warehousing, delivery, and supply-chain automation.', 5, TRUE),
  ('Consumer', 'consumer', 'Smart consumer robots that enhance everyday home and personal experiences.', 6, TRUE)
ON CONFLICT (slug) DO NOTHING;

-- Seed: milestones
INSERT INTO milestones (year, title, description, display_order) VALUES
  (2015, 'Founded', '13698491 Canada Inc. was founded in Milton, Ontario, with a vision to democratize robotics technology.', 1),
  (2017, 'First Robot Prototype', 'Successfully developed and demonstrated our first fully-functional humanoid robot prototype, marking a pivotal milestone in Canadian robotics.', 2),
  (2019, 'International Expansion', 'Expanded operations to international markets, establishing partnerships across North America, Europe, and Asia-Pacific.', 3),
  (2021, '100+ Patents', 'Surpassed 100 filed patents across robotics, AI vision, proprioceptive sensing, and autonomous navigation technologies.', 4),
  (2023, 'Healthcare Division Launch', 'Launched a dedicated Healthcare Division with specialized robots designed for hospital logistics, patient assistance, and clinical workflows.', 5),
  (2025, 'Raasbot Platform Launch', 'Introduced the Raasbot platform — a unified commerce and deployment ecosystem enabling businesses to purchase, rent, and manage robot fleets at scale.', 6)
ON CONFLICT DO NOTHING;

-- Seed: site_settings
INSERT INTO site_settings (key, value, description) VALUES
  (
    'company',
    '{
      "name": "Raasbot",
      "legal": "13698491 Canada Inc.",
      "address": "1202 Stirling Todd Terrace, Milton, Ontario, Canada",
      "email": "info@raasbot.com",
      "phone": "+1-647-000-0000",
      "website": "https://raasbot.com",
      "founded": 2015,
      "registration": "13698491"
    }',
    'Core company information used across storefront and legal documents.'
  ),
  (
    'social',
    '{
      "twitter": "",
      "linkedin": "",
      "youtube": "",
      "instagram": "",
      "facebook": ""
    }',
    'Social media profile URLs.'
  ),
  (
    'seo',
    '{
      "defaultTitle": "Raasbot — Advanced Robotics for Every Industry",
      "titleTemplate": "%s | Raasbot",
      "defaultDescription": "Raasbot delivers cutting-edge humanoid, commercial, healthcare, and logistics robots. Purchase or rent the latest AI-powered robots for your business.",
      "ogImage": "/images/og-default.jpg"
    }',
    'Default SEO configuration for the storefront.'
  ),
  (
    'checkout',
    '{
      "currency": "cad",
      "depositAmount": 9900,
      "taxRate": 0.13,
      "shippingCountries": ["CA", "US"],
      "stripePublishableKey": ""
    }',
    'Checkout and payment configuration.'
  )
ON CONFLICT (key) DO UPDATE
  SET value = EXCLUDED.value,
      updated_at = NOW();
