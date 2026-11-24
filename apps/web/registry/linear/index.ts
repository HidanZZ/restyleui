import type { Kit } from "@/registry/restyle/lib/contract"
import { Accordion } from "@/registry/linear/components/accordion"
import { Badge } from "@/registry/linear/components/badge"
import { Button } from "@/registry/linear/components/button"
import { Card } from "@/registry/linear/components/card"
import { Carousel } from "@/registry/linear/components/carousel"
import { CountUp } from "@/registry/linear/components/count-up"
import { Cta } from "@/registry/linear/components/cta"
import { Dialog } from "@/registry/linear/components/dialog"
import { Faq } from "@/registry/linear/components/faq"
import { FeatureGrid } from "@/registry/linear/components/feature-grid"
import { FeatureTabs } from "@/registry/linear/components/feature-tabs"
import { Footer } from "@/registry/linear/components/footer"
import { FooterSection } from "@/registry/linear/components/footer-section"
import { Hero } from "@/registry/linear/components/hero"
import { Input } from "@/registry/linear/components/input"
import { LogoRow } from "@/registry/linear/components/logo-row"
import { LogoStrip } from "@/registry/linear/components/logo-strip"
import { Marquee } from "@/registry/linear/components/marquee"
import { Navbar } from "@/registry/linear/components/navbar"
import { ProductDemoHero } from "@/registry/linear/components/product-demo-hero"
import { Reveal } from "@/registry/linear/components/reveal"
import { Tabs } from "@/registry/linear/components/tabs"
import { TechSpecDrawer } from "@/registry/linear/components/tech-spec-drawer"
import { Testimonials } from "@/registry/linear/components/testimonials"
import { TextLink } from "@/registry/linear/components/text-link"

export const kit = {
  Button,
  TextLink,
  Badge,
  Card,
  LogoRow,
  Navbar,
  Footer,
  Tabs,
  Accordion,
  Dialog,
  Carousel,
  Marquee,
  Reveal,
  CountUp,
  Input,
  Hero,
  LogoStrip,
  FeatureGrid,
  FeatureTabs,
  Testimonials,
  Faq,
  Cta,
  FooterSection,
} satisfies Kit

export const unique = {
  "product-demo-hero": ProductDemoHero,
  "tech-spec-drawer": TechSpecDrawer,
}
