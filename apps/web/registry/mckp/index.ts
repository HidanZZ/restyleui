import type { Kit } from "@/registry/restyle/lib/contract"
import { Accordion } from "@/registry/mckp/components/accordion"
import { Badge } from "@/registry/mckp/components/badge"
import { Button } from "@/registry/mckp/components/button"
import { Card } from "@/registry/mckp/components/card"
import { Carousel } from "@/registry/mckp/components/carousel"
import { CodeTypingDemo } from "@/registry/mckp/components/code-typing-demo"
import { CountUp } from "@/registry/mckp/components/count-up"
import { Cta } from "@/registry/mckp/components/cta"
import { Dialog } from "@/registry/mckp/components/dialog"
import { Faq } from "@/registry/mckp/components/faq"
import { FeatureGrid } from "@/registry/mckp/components/feature-grid"
import { FeatureTabs } from "@/registry/mckp/components/feature-tabs"
import { Footer } from "@/registry/mckp/components/footer"
import { FooterSection } from "@/registry/mckp/components/footer-section"
import { Hero } from "@/registry/mckp/components/hero"
import { Input } from "@/registry/mckp/components/input"
import { LibraryPreview } from "@/registry/mckp/components/library-preview"
import { LogoRow } from "@/registry/mckp/components/logo-row"
import { LogoStrip } from "@/registry/mckp/components/logo-strip"
import { Marquee } from "@/registry/mckp/components/marquee"
import { Navbar } from "@/registry/mckp/components/navbar"
import { Reveal } from "@/registry/mckp/components/reveal"
import { Tabs } from "@/registry/mckp/components/tabs"
import { Testimonials } from "@/registry/mckp/components/testimonials"
import { TextLink } from "@/registry/mckp/components/text-link"

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
  "library-preview": LibraryPreview,
  "code-typing-demo": CodeTypingDemo,
}
