import type { Kit } from "@/registry/restyle/lib/contract"
import { Accordion } from "@/registry/teamwork/components/accordion"
import { Badge } from "@/registry/teamwork/components/badge"
import { Button } from "@/registry/teamwork/components/button"
import { Card } from "@/registry/teamwork/components/card"
import { Carousel } from "@/registry/teamwork/components/carousel"
import { ConnectorMarquee } from "@/registry/teamwork/components/connector-marquee"
import { CountUp } from "@/registry/teamwork/components/count-up"
import { Cta } from "@/registry/teamwork/components/cta"
import { Dialog } from "@/registry/teamwork/components/dialog"
import { Faq } from "@/registry/teamwork/components/faq"
import { FeatureGrid } from "@/registry/teamwork/components/feature-grid"
import { FeatureTabs } from "@/registry/teamwork/components/feature-tabs"
import { Footer } from "@/registry/teamwork/components/footer"
import { FooterSection } from "@/registry/teamwork/components/footer-section"
import { Hero } from "@/registry/teamwork/components/hero"
import { Input } from "@/registry/teamwork/components/input"
import { LogoRow } from "@/registry/teamwork/components/logo-row"
import { LogoStrip } from "@/registry/teamwork/components/logo-strip"
import { Marquee } from "@/registry/teamwork/components/marquee"
import { Navbar } from "@/registry/teamwork/components/navbar"
import { Odometer } from "@/registry/teamwork/components/odometer"
import { OverviewCarousel } from "@/registry/teamwork/components/overview-carousel"
import { Reveal } from "@/registry/teamwork/components/reveal"
import { Tabs } from "@/registry/teamwork/components/tabs"
import { Testimonials } from "@/registry/teamwork/components/testimonials"
import { TextLink } from "@/registry/teamwork/components/text-link"

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
  odometer: Odometer,
  "overview-carousel": OverviewCarousel,
  "connector-marquee": ConnectorMarquee,
}
