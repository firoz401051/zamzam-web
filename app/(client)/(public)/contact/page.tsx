"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  HeartHandshake,
  Users,
} from "lucide-react";
import { FormEvent, useState } from "react";
import { motion } from "motion/react";
import Container from "@/components/Container";
import { useAuth } from "@clerk/nextjs";
import LoginRequiredMessage from "@/components/LoginRequiredMessage";

const ContactPage = () => {
  const { isSignedIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData();
    const currentDateTime = new Date().toLocaleString();
    form.append("Name", formData.name);
    form.append("Email", formData.email);
    form.append("Message", formData.message);
    form.append("DateTime", currentDateTime);
    setLoading(true);
    setSuccess(false);

    try {
      // Get your getform.io endpoint from the dashboard
      // and replace the empty string with your endpoint
      // --------------------- xxx ---------------------
      // const response = await fetch('', {
      //   method: "POST",
      //   body: form,
      // });

      // if (response?.ok) {
      //   setFormData({
      //     name: "",
      //     email: "",
      //     interest: "",
      //     budget: "",
      //     message: "",
      //   });
      // }
      setFormData({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      console.error("Form submitting Error", error);
    } finally {
      setLoading(false);
      setSuccess(true);
    }
  };
  return (
    <div className="min-h-screen bg-linear-to-br from-zamzam-background to-zamzam-surface">
      <Container className="py-12 lg:py-20">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-zamzam-primary-light rounded-full mb-6">
            <MessageCircle className="w-4 h-4 text-zamzam-primary" />
            <span className="text-sm font-medium text-zamzam-primary">
              Get in Touch
            </span>
            <HeartHandshake className="w-4 h-4 text-zamzam-primary" />
          </div>
          <h1 className="text-3xl lg:text-5xl font-bold text-zamzam-text-dark mb-4">
            Contact <span className="text-zamzam-primary">ZamZam</span>
          </h1>
          <p className="text-zamzam-text-medium text-lg max-w-2xl mx-auto leading-relaxed">
            We&apos;d love to hear from you! Whether you have questions,
            feedback, or need support, our team is here to help you have the
            best shopping experience.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information Cards */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Contact Methods */}
            <Card className="border-zamzam-surface hover:border-zamzam-primary/20 transition-colors duration-300 shadow-sm hover:shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-zamzam-text-dark">
                  <Phone className="w-5 h-5 text-zamzam-primary" />
                  Phone Support
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-zamzam-text-medium font-medium">
                  +91 9739625092 <br />
                  +91 8660307627 <br />
                  +91 9343779840
                </p>
                <Badge variant="outline" className="text-xs">
                  24/7 Available
                </Badge>
              </CardContent>
            </Card>

            <Card className="border-zamzam-surface hover:border-zamzam-primary/20 transition-colors duration-300 shadow-sm hover:shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-zamzam-text-dark">
                  <Mail className="w-5 h-5 text-zamzam-primary" />
                  Email Us
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-zamzam-text-medium font-medium">
                  zamzamfashionstore@gmail.com
                </p>
                <Badge variant="outline" className="text-xs">
                  Response within 24hrs
                </Badge>
              </CardContent>
            </Card>

            <Card className="border-zamzam-surface hover:border-zamzam-primary/20 transition-colors duration-300 shadow-sm hover:shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-zamzam-text-dark">
                  <MapPin className="w-5 h-5 text-zamzam-primary" />
                  Visit Us
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-zamzam-text-medium">
                  A.S. Complex <br />
                  Mehdi Nagar <br />
                  Palacode Dharmapuri <br />
                  Tamil Nadu 636808
                </p>
                <Badge variant="outline" className="text-xs">
                  10AM-9PM
                </Badge>
              </CardContent>
            </Card>

            {/* Business Hours */}
            <Card className="bg-zamzam-primary text-white border-none shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Business Hours
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Monday - Sunday:</span>
                  <span>10:00 AM - 9:00 PM</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card className="border-zamzam-surface shadow-xl">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl text-zamzam-text-dark flex items-center gap-2">
                  <Send className="w-6 h-6 text-zamzam-primary" />
                  Send us a Message
                </CardTitle>
                <p className="text-zamzam-text-medium">
                  Fill out the form below and we&apos;ll get back to you as soon
                  as possible.
                </p>
              </CardHeader>
              <CardContent>
                {!isSignedIn && (
                  <div className="mb-6">
                    <LoginRequiredMessage 
                      title="Login Required"
                      details="Please sign in to send us a message. We want to ensure we can get back to you securely."
                    />
                  </div>
                )}
                <form className={`space-y-6 ${!isSignedIn ? 'opacity-50 pointer-events-none' : ''}`} onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="name"
                        className="text-zamzam-text-dark font-medium"
                      >
                        Full Name *
                      </Label>
                      <Input
                        disabled={loading || !isSignedIn}
                        type="text"
                        name="name"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="border-zamzam-surface focus:border-zamzam-primary focus:ring-zamzam-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-zamzam-text-dark font-medium"
                      >
                        Email Address *
                      </Label>
                      <Input
                        disabled={loading || !isSignedIn}
                        type="email"
                        name="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="border-zamzam-surface focus:border-zamzam-primary focus:ring-zamzam-primary/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="message"
                      className="text-zamzam-text-dark font-medium"
                    >
                      Your Message *
                    </Label>
                    <Textarea
                      disabled={loading || !isSignedIn}
                      value={formData.message}
                      onChange={handleChange}
                      id="message"
                      name="message"
                      rows={6}
                      placeholder="Tell us how we can help you..."
                      className="border-zamzam-surface focus:border-zamzam-primary focus:ring-zamzam-primary/20 resize-none"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading || !isSignedIn}
                    size="lg"
                    className="w-full bg-zamzam-primary hover:bg-zamzam-primary-hover text-white font-semibold py-3 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    {loading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                        />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Why Contact Us Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16"
        >
          <Card className="bg-linear-to-r from-zamzam-primary/5 to-zamzam-primary-light border-zamzam-primary/20">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <Users className="w-8 h-8 text-zamzam-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-zamzam-text-dark mb-2">
                  Why Contact ZamZam?
                </h3>
                <p className="text-zamzam-text-medium">
                  We&apos;re committed to providing exceptional customer service
                  and support
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="p-4">
                  <div className="w-12 h-12 bg-zamzam-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-6 h-6 text-zamzam-primary" />
                  </div>
                  <h4 className="font-semibold text-zamzam-text-dark mb-2">
                    Quick Response
                  </h4>
                  <p className="text-sm text-zamzam-text-medium">
                    Get answers to your questions within 24 hours
                  </p>
                </div>

                <div className="p-4">
                  <div className="w-12 h-12 bg-zamzam-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <HeartHandshake className="w-6 h-6 text-zamzam-primary" />
                  </div>
                  <h4 className="font-semibold text-zamzam-text-dark mb-2">
                    Personal Support
                  </h4>
                  <p className="text-sm text-zamzam-text-medium">
                    Talk to real people who care about your experience
                  </p>
                </div>

                <div className="p-4">
                  <div className="w-12 h-12 bg-zamzam-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MessageCircle className="w-6 h-6 text-zamzam-primary" />
                  </div>
                  <h4 className="font-semibold text-zamzam-text-dark mb-2">
                    Multiple Channels
                  </h4>
                  <p className="text-sm text-zamzam-text-medium">
                    Reach us via phone, email, or visit our store
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
      {/* Success Modal */}
      {success && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full"
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 0.2,
                  type: "spring",
                  stiffness: 200,
                  damping: 10,
                }}
                className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle className="w-12 h-12 text-green-500" />
              </motion.div>

              <h2 className="text-2xl lg:text-3xl font-bold text-zamzam-text-dark mb-4">
                Message Sent Successfully!
              </h2>

              <p className="text-zamzam-text-medium mb-6 leading-relaxed">
                Thank you for reaching out to zamzam! We&apos;ve received your
                message and will get back to you within 24 hours.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => setSuccess(false)}
                  className="flex-1 bg-zamzam-primary hover:bg-zamzam-primary-hover text-white font-semibold transition-all duration-300"
                >
                  Continue Shopping
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSuccess(false)}
                  className="flex-1 border-zamzam-surface hover:bg-zamzam-surface text-zamzam-text-dark"
                >
                  Close
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};
export default ContactPage;
