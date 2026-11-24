import type { Kit } from "@/registry/restyle/lib/contract"
import { Accordion } from "@/registry/norma/components/accordion"
import { Badge } from "@/registry/norma/components/badge"
import { Button } from "@/registry/norma/components/button"
import { Card } from "@/registry/norma/components/card"
import { Carousel } from "@/registry/norma/components/carousel"
import { CountUp } from "@/registry/norma/components/count-up"
import { Cta } from "@/registry/norma/components/cta"
import { Dialog } from "@/registry/norma/components/dialog"
import { Faq } from "@/registry/norma/components/faq"
import { FeatureGrid } from "@/registry/norma/components/feature-grid"
import { FeatureTabs } from "@/registry/norma/components/feature-tabs"
import { Footer } from "@/registry/norma/components/footer"
import { FooterSection } from "@/registry/norma/components/footer-section"
import { Globe } from "@/registry/norma/components/globe"
import { Hero } from "@/registry/norma/components/hero"
import { Input } from "@/registry/norma/components/input"
import { LogoRow } from "@/registry/norma/components/logo-row"
import { LogoStrip } from "@/registry/norma/components/logo-strip"
import { Marquee } from "@/registry/norma/components/marquee"
import { Navbar } from "@/registry/norma/components/navbar"
import { Reveal } from "@/registry/norma/components/reveal"
import { ScreenTimeCalculator } from "@/registry/norma/components/screen-time-calculator"
import { ScrollVideoReveal } from "@/registry/norma/components/scroll-video-reveal"
import { Tabs } from "@/registry/norma/components/tabs"
import { Testimonials } from "@/registry/norma/components/testimonials"
import { TextLink } from "@/registry/norma/components/text-link"

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
  globe: Globe,
  "scroll-video-reveal": ScrollVideoReveal,
  "screen-time-calculator": ScreenTimeCalculator,
}
