import type { Kit } from "@/registry/restyle/lib/contract"
import { Accordion } from "@/registry/apple/components/accordion"
import { Badge } from "@/registry/apple/components/badge"
import { Button } from "@/registry/apple/components/button"
import { Card } from "@/registry/apple/components/card"
import { Carousel } from "@/registry/apple/components/carousel"
import { CountUp } from "@/registry/apple/components/count-up"
import { Cta } from "@/registry/apple/components/cta"
import { Dialog } from "@/registry/apple/components/dialog"
import { EndlessGallery } from "@/registry/apple/components/endless-gallery"
import { Faq } from "@/registry/apple/components/faq"
import { FeatureGrid } from "@/registry/apple/components/feature-grid"
import { FeatureTabs } from "@/registry/apple/components/feature-tabs"
import { Footer } from "@/registry/apple/components/footer"
import { FooterSection } from "@/registry/apple/components/footer-section"
import { Hero } from "@/registry/apple/components/hero"
import { Input } from "@/registry/apple/components/input"
import { LogoRow } from "@/registry/apple/components/logo-row"
import { LogoStrip } from "@/registry/apple/components/logo-strip"
import { Marquee } from "@/registry/apple/components/marquee"
import { MegaNav } from "@/registry/apple/components/mega-nav"
import { Navbar } from "@/registry/apple/components/navbar"
import { Reveal } from "@/registry/apple/components/reveal"
import { Tabs } from "@/registry/apple/components/tabs"
import { Testimonials } from "@/registry/apple/components/testimonials"
import { TextLink } from "@/registry/apple/components/text-link"

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
  "endless-gallery": EndlessGallery,
  "mega-nav": MegaNav,
}
