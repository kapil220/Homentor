import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-homentor-mist border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Brand */}
          <div className="md:col-span-5">
            <Link to="/" className="inline-block">
              <img
                src="/lovable-uploads/logo-name.png"
                alt="Homentor"
                className="h-10"
              />
            </Link>
            <p className="mt-4 text-sm text-slate-600 leading-relaxed max-w-sm">
              Verified home tutors and subject mentors, hand-picked for your child's pace and goals.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a
                href="https://www.facebook.com/profile.php?id=61568577280975"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-lg bg-white border border-slate-200 text-homentor-blue hover:bg-homentor-blue hover:text-white hover:border-homentor-blue transition-colors flex items-center justify-center"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/homentor_official"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-lg bg-white border border-slate-200 text-homentor-blue hover:bg-homentor-blue hover:text-white hover:border-homentor-blue transition-colors flex items-center justify-center"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="md:col-span-3">
            <h3 className="font-heading font-semibold text-sm uppercase tracking-wider text-slate-500">Product</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link to="/mentors" className="text-slate-700 hover:text-homentor-blue transition-colors">Find a mentor</Link></li>
              <li><Link to="/for-mentors" className="text-slate-700 hover:text-homentor-blue transition-colors">Become a mentor</Link></li>
              <li><Link to="/about-us" className="text-slate-700 hover:text-homentor-blue transition-colors">About</Link></li>
              <li><Link to="/contact-us" className="text-slate-700 hover:text-homentor-blue transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-4">
            <h3 className="font-heading font-semibold text-sm uppercase tracking-wider text-slate-500">Get in touch</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li className="flex items-center gap-2 text-slate-700">
                <Phone className="w-4 h-4 text-homentor-blue shrink-0" />
                <a href="tel:+919203149956" className="hover:text-homentor-blue transition-colors">
                  +91 9203149956
                </a>
              </li>
              <li className="flex items-center gap-2 text-slate-700">
                <Mail className="w-4 h-4 text-homentor-blue shrink-0" />
                <a href="mailto:homentorindia@gmail.com" className="hover:text-homentor-blue transition-colors">
                  homentorindia@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2 text-slate-700">
                <MapPin className="w-4 h-4 text-homentor-blue shrink-0 mt-0.5" />
                <span>Indore, Madhya Pradesh</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Homentor. All rights reserved.
          </p>
          <div className="flex items-center gap-5 text-xs text-slate-500">
            <Link to="/terms-conditions" className="hover:text-homentor-blue transition-colors">Terms</Link>
            <Link to="/privacy-policy" className="hover:text-homentor-blue transition-colors">Privacy</Link>
            <Link to="/refund" className="hover:text-homentor-blue transition-colors">Refund</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
