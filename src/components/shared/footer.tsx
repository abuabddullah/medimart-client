import { FacebookIcon, GithubIcon, LinkedinIcon } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">MediMart</h3>
            <p className="text-muted-foreground">
              Your trusted online pharmacy for all your healthcare needs.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/shop"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Medicines
                </Link>
              </li>
              <li>
                <Link
                  href="/prescriptions/upload"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Prescription Upload
                </Link>
              </li>
              <li>
                <Link
                  href="/orders"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Orders
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <a
                  href="/#faq"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  FAQs
                </a>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Cart
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <div>
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a
                  href="https://www.facebook.com/asifaowadud/"
                  target="_blank"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <FacebookIcon />
                </a>
                <a
                  href="https://www.linkedin.com/in/asifaowadud"
                  target="_blank"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <LinkedinIcon />
                </a>
                <a
                  href="https://github.com/abuabddullah"
                  target="_blank"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <GithubIcon />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} MediMart. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
