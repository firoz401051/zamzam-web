"use client";

import {
  Mail,
  Phone,
  MessageSquare,
  Clock,
  MapPin,
  HelpCircle,
  Search,
  Package,
  RefreshCw,
  CreditCard,
  Truck,
  CheckCircle,
} from "lucide-react";
import { useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Container from "@/components/Container";

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Container className="py-8">
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4 animate-fade-in">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-zamzam-primary/10 rounded-full animate-bounce">
              <HelpCircle className="w-12 h-12 text-zamzam-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-zamzam-text-dark">
            How can we help you?
          </h1>
          <p className="text-xl text-zamzam-text-muted max-w-2xl mx-auto">
            Find answers to your questions about zamzam. We&apos;re here to
            make your shopping experience amazing.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto animate-fade-in-up">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zamzam-text-muted w-5 h-5" />
            <Input
              type="text"
              placeholder="Search for help topics, order issues, returns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-6 text-lg border-2 border-gray-200 rounded-xl focus:border-zamzam-primary focus:ring-2 focus:ring-zamzam-primary/20 transition-all"
            />
            <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-zamzam-primary hover:bg-zamzam-primary/90">
              Search
            </Button>
          </div>
        </div>

        {/* Quick Help Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-zamzam-primary/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="p-2 bg-red-50 rounded-lg group-hover:bg-red-100 transition-colors">
                  <Phone className="w-8 h-8 text-red-600" />
                </div>
                <div className="text-red-600 text-sm font-medium bg-red-50 px-2 py-1 rounded-full">
                  24/7 Available
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="font-medium text-zamzam-text-dark">
                Customer Support Hotline
              </div>
              <div className="text-xl font-bold text-zamzam-primary">
                1-800-zamzam
              </div>
              <div className="flex items-center gap-2 text-sm text-zamzam-text-muted">
                <Clock className="w-4 h-4" />
                Available 24/7 for urgent issues
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full group-hover:bg-zamzam-primary group-hover:text-white transition-colors"
              >
                Call Now
              </Button>
            </CardFooter>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-zamzam-primary/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                  <Mail className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-blue-600 text-sm font-medium bg-blue-50 px-2 py-1 rounded-full">
                  Response in 2h
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="font-medium text-zamzam-text-dark">
                Customer Service Email
              </div>
              <div className="text-xl font-bold text-zamzam-primary">
                support@zamzam.com
              </div>
              <div className="flex items-center gap-2 text-sm text-zamzam-text-muted">
                <Clock className="w-4 h-4" />
                Typical response within 2 hours
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full group-hover:bg-zamzam-primary group-hover:text-white transition-colors"
              >
                Send Email
              </Button>
            </CardFooter>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-zamzam-primary/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="p-2 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
                  <MessageSquare className="w-8 h-8 text-green-600" />
                </div>
                <div className="text-green-600 text-sm font-medium bg-green-50 px-2 py-1 rounded-full">
                  Instant Help
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="font-medium text-zamzam-text-dark">
                Live Chat Support
              </div>
              <div className="text-xl font-bold text-zamzam-primary">
                Chat with us
              </div>
              <div className="flex items-center gap-2 text-sm text-zamzam-text-muted">
                <Clock className="w-4 h-4" />
                Mon-Fri: 9AM-9PM EST
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full group-hover:bg-zamzam-primary group-hover:text-white transition-colors"
              >
                Start Chat
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Main Help Content */}
        <Tabs defaultValue="faq" className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:w-[500px] mx-auto bg-gray-100 p-1 rounded-xl">
            <TabsTrigger
              value="faq"
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-zamzam-primary"
            >
              <HelpCircle className="w-4 h-4" />
              FAQ
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-zamzam-primary"
            >
              <Package className="w-4 h-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger
              value="returns"
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-zamzam-primary"
            >
              <RefreshCw className="w-4 h-4" />
              Returns
            </TabsTrigger>
          </TabsList>

          <TabsContent value="faq" className="mt-8 animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-zamzam-text-dark">
                  Frequently Asked Questions
                </CardTitle>
                <CardDescription className="text-zamzam-text-muted">
                  Find quick answers to the most common questions about zamzam
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="space-y-4">
                  <AccordionItem
                    value="item-1"
                    className="border border-gray-200 rounded-lg px-4 hover:border-zamzam-primary transition-colors"
                  >
                    <AccordionTrigger className="text-zamzam-text-dark hover:text-zamzam-primary">
                      <div className="flex items-center gap-3">
                        <Truck className="w-5 h-5 text-zamzam-primary" />
                        How do I track my order on zamzam?
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-zamzam-text-muted pt-4">
                      <div className="space-y-3">
                        <p>
                          You can track your zamzam order in several ways:
                        </p>
                        <ul className="space-y-2 ml-4">
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            Log into your zamzam account and visit the
                            &ldquo;My Orders&rdquo; section
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            Use the tracking number from your shipping
                            confirmation email
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            Check your dashboard for real-time updates
                          </li>
                        </ul>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem
                    value="item-2"
                    className="border border-gray-200 rounded-lg px-4 hover:border-zamzam-primary transition-colors"
                  >
                    <AccordionTrigger className="text-zamzam-text-dark hover:text-zamzam-primary">
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-zamzam-primary" />
                        What payment methods does zamzam accept?
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-zamzam-text-muted pt-4">
                      <div className="space-y-3">
                        <p>
                          zamzam accepts a wide variety of secure payment
                          methods:
                        </p>
                        <div className="grid gap-3 md:grid-cols-2">
                          <div className="space-y-2">
                            <h5 className="font-medium text-zamzam-text-dark">
                              Credit & Debit Cards:
                            </h5>
                            <ul className="space-y-1 ml-4 text-sm">
                              <li>• Visa</li>
                              <li>• Mastercard</li>
                              <li>• American Express</li>
                              <li>• Discover</li>
                            </ul>
                          </div>
                          <div className="space-y-2">
                            <h5 className="font-medium text-zamzam-text-dark">
                              Digital Wallets:
                            </h5>
                            <ul className="space-y-1 ml-4 text-sm">
                              <li>• PayPal</li>
                              <li>• Apple Pay</li>
                              <li>• Google Pay</li>
                              <li>• Buy Now, Pay Later options</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem
                    value="item-3"
                    className="border border-gray-200 rounded-lg px-4 hover:border-zamzam-primary transition-colors"
                  >
                    <AccordionTrigger className="text-zamzam-text-dark hover:text-zamzam-primary">
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-zamzam-primary" />
                        How long does zamzam shipping take?
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-zamzam-text-muted pt-4">
                      <div className="space-y-3">
                        <p>
                          zamzam offers multiple shipping options to meet your
                          needs:
                        </p>
                        <div className="grid gap-3 md:grid-cols-3">
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <h5 className="font-medium text-zamzam-text-dark">
                              Standard Shipping
                            </h5>
                            <p className="text-sm">3-5 business days</p>
                            <p className="text-xs text-zamzam-text-muted">
                              Free on orders over $50
                            </p>
                          </div>
                          <div className="p-3 bg-orange-50 rounded-lg">
                            <h5 className="font-medium text-zamzam-text-dark">
                              Express Shipping
                            </h5>
                            <p className="text-sm">1-2 business days</p>
                            <p className="text-xs text-zamzam-text-muted">
                              Additional fees apply
                            </p>
                          </div>
                          <div className="p-3 bg-green-50 rounded-lg">
                            <h5 className="font-medium text-zamzam-text-dark">
                              International
                            </h5>
                            <p className="text-sm">7-14 business days</p>
                            <p className="text-xs text-zamzam-text-muted">
                              Varies by location
                            </p>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem
                    value="item-4"
                    className="border border-gray-200 rounded-lg px-4 hover:border-zamzam-primary transition-colors"
                  >
                    <AccordionTrigger className="text-zamzam-text-dark hover:text-zamzam-primary">
                      <div className="flex items-center gap-3">
                        <RefreshCw className="w-5 h-5 text-zamzam-primary" />
                        What is zamzam&apos;s return policy?
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-zamzam-text-muted pt-4">
                      <div className="space-y-4">
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                          <h5 className="font-medium text-green-800 mb-2">
                            30-Day Return Guarantee
                          </h5>
                          <p className="text-sm text-green-700">
                            We offer a hassle-free 30-day return policy for most
                            items purchased on zamzam.
                          </p>
                        </div>
                        <div className="space-y-2">
                          <h6 className="font-medium text-zamzam-text-dark">
                            Return Requirements:
                          </h6>
                          <ul className="space-y-1 ml-4 text-sm">
                            <li>
                              • Items must be in original condition with tags
                              attached
                            </li>
                            <li>• Original packaging and receipt required</li>
                            <li>
                              • Some items (intimate apparel, personalized
                              products) are not returnable
                            </li>
                            <li>
                              • Return shipping is free for defective items
                            </li>
                          </ul>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem
                    value="item-5"
                    className="border border-gray-200 rounded-lg px-4 hover:border-zamzam-primary transition-colors"
                  >
                    <AccordionTrigger className="text-zamzam-text-dark hover:text-zamzam-primary">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-zamzam-primary" />
                        Does zamzam ship internationally?
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-zamzam-text-muted pt-4">
                      <div className="space-y-3">
                        <p>
                          Yes! zamzam proudly ships to over 100 countries
                          worldwide.
                        </p>
                        <div className="grid gap-3 md:grid-cols-2">
                          <div className="space-y-2">
                            <h5 className="font-medium text-zamzam-text-dark">
                              Available Regions:
                            </h5>
                            <ul className="space-y-1 ml-4 text-sm">
                              <li>• North America</li>
                              <li>• Europe</li>
                              <li>• Asia Pacific</li>
                              <li>• Latin America</li>
                            </ul>
                          </div>
                          <div className="space-y-2">
                            <h5 className="font-medium text-zamzam-text-dark">
                              International Features:
                            </h5>
                            <ul className="space-y-1 ml-4 text-sm">
                              <li>• Customs handling included</li>
                              <li>• Multi-currency support</li>
                              <li>• Local return options</li>
                              <li>• Tracking in multiple languages</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-6 w-6 text-primary" />
                  Order Management
                </CardTitle>
                <CardDescription>
                  Everything you need to know about placing and managing your
                  zamzam orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible>
                  <AccordionItem value="order-1">
                    <AccordionTrigger>
                      How do I place an order on zamzam?
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        <p>
                          Placing an order on zamzam is simple and secure:
                        </p>
                        <ol className="list-decimal list-inside space-y-2 ml-4">
                          <li>
                            Browse our products and add items to your cart
                          </li>
                          <li>Click on the cart icon and review your items</li>
                          <li>
                            Click &ldquo;Checkout&rdquo; and enter your shipping
                            information
                          </li>
                          <li>Select your preferred payment method</li>
                          <li>
                            Review your order and click &ldquo;Place
                            Order&rdquo;
                          </li>
                          <li>
                            You&apos;ll receive a confirmation email with order
                            details
                          </li>
                        </ol>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="order-2">
                    <AccordionTrigger>
                      Can I modify or cancel my order after placing it?
                    </AccordionTrigger>
                    <AccordionContent>
                      Yes, but timing is important. You can modify or cancel
                      your order within 1 hour of placing it, as long as it
                      hasn&apos;t been shipped yet. Contact our customer service
                      team immediately at 1-800-zamzam or through live chat
                      for assistance.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="order-3">
                    <AccordionTrigger>
                      What should I do if I receive a damaged item?
                    </AccordionTrigger>
                    <AccordionContent>
                      We&apos;re sorry to hear about any damage! Please contact
                      us within 48 hours of receiving your order with photos of
                      the damaged item and packaging. We&apos;ll arrange for a
                      replacement or full refund, and provide a prepaid return
                      label if needed.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="returns" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="h-6 w-6 text-primary" />
                  Returns & Exchanges
                </CardTitle>
                <CardDescription>
                  Our hassle-free return and exchange process
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible>
                  <AccordionItem value="return-1">
                    <AccordionTrigger>
                      How do I start a return?
                    </AccordionTrigger>
                    <AccordionContent>
                      Starting a return is easy with zamzam. Log into your
                      account, go to &ldquo;Order History&rdquo;, find the order
                      you want to return, and click &ldquo;Return Items&rdquo;.
                      Follow the prompts to select items and reason for return.
                      We&apos;ll email you a prepaid return label.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="return-2">
                    <AccordionTrigger>
                      How long do I have to return an item?
                    </AccordionTrigger>
                    <AccordionContent>
                      You have 30 days from the delivery date to return most
                      items. Some exceptions apply to certain product categories
                      like intimate apparel, personalized items, and final sale
                      products. Check the product page for specific return
                      policies.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="return-3">
                    <AccordionTrigger>
                      Is return shipping free?
                    </AccordionTrigger>
                    <AccordionContent>
                      Return shipping is free for defective or incorrect items.
                      For other returns, a small return shipping fee may apply
                      unless you&apos;re a zamzam Plus member - Plus members
                      receive free return shipping on all orders.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="return-4">
                    <AccordionTrigger>
                      Can I exchange an item instead of returning it?
                    </AccordionTrigger>
                    <AccordionContent>
                      Yes, you can request an exchange for a different size or
                      color of the same item during the return process. If the
                      item you want is in stock, we&apos;ll ship it once we
                      receive your return.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Visit Our Store
              </CardTitle>
              <CardDescription>
                Get in-person assistance at our locations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">zamzam Flagship Store</h4>
                  <p className="text-sm text-muted-foreground">
                    123 Commerce Street, Shopping District
                  </p>
                  <p className="text-sm text-muted-foreground">
                    New York, NY 10001
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4" />
                  <span>Mon-Sat: 9AM-9PM, Sun: 11AM-7PM</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Get Directions
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" />
                Still Need Help?
              </CardTitle>
              <CardDescription>
                Our customer service team is here for you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col items-center justify-center p-4 text-center border rounded-lg">
                  <Phone className="h-10 w-10 text-primary mb-2" />
                  <h3 className="text-lg font-medium">Call Us</h3>
                  <p className="text-sm text-muted-foreground">
                    Speak directly with our support team
                  </p>
                  <Button className="mt-4">1-800-SHOP-HELP</Button>
                </div>
                <div className="flex flex-col items-center justify-center p-4 text-center border rounded-lg">
                  <MessageSquare className="h-10 w-10 text-primary mb-2" />
                  <h3 className="text-lg font-medium">Message Us</h3>
                  <p className="text-sm text-muted-foreground">
                    Send us a message and we&apos;ll get back to you
                  </p>
                  <Button variant="outline" className="mt-4">
                    Contact Form
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}
