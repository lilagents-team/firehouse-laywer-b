import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-near-black text-white py-16 urban-concrete">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          <div className="lg:col-span-2 mb-8 lg:mb-0">
            <h3 className="text-2xl font-bebas font-bold mb-4 tracking-wider text-shadow-gritty">ERIC T. QUINN, P.S.</h3>
            <p className="text-gray-100 mb-6 max-w-md font-montserrat">
              Dedicated to representing the Fire Service with specialized legal counsel for fire districts, 
              regional fire authorities, and public agencies across the Pacific Northwest.
            </p>
          </div>

          <div className="mb-8 lg:mb-0">
            <h4 className="text-xl font-bebas font-semibold mb-6 tracking-wide text-shadow-gritty">QUICK LINKS</h4>
            <ul className="space-y-3">
              <li><Link href="/" className="text-neon-orange hover:text-red-400 transition-colors font-montserrat uppercase tracking-wide text-sm" data-testid="footer-link-home">Home</Link></li>
              <li><Link href="/practice-areas" className="text-neon-orange hover:text-red-400 transition-colors font-montserrat uppercase tracking-wide text-sm" data-testid="footer-link-practice-areas">Practice Areas</Link></li>
              <li><Link href="/attorneys" className="text-neon-orange hover:text-red-400 transition-colors font-montserrat uppercase tracking-wide text-sm" data-testid="footer-link-attorneys">Our Attorneys</Link></li>
              <li><Link href="/newsletter" className="text-neon-orange hover:text-red-400 transition-colors font-montserrat uppercase tracking-wide text-sm" data-testid="footer-link-newsletter">Newsletter</Link></li>
              <li><Link href="/contact" className="text-neon-orange hover:text-red-400 transition-colors font-montserrat uppercase tracking-wide text-sm" data-testid="footer-link-contact">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-bebas font-semibold mb-6 tracking-wide text-shadow-gritty">CONTACT INFO</h4>
            <div className="space-y-3 text-gray-100 font-montserrat">
              <p className="text-sm leading-relaxed">7403 Lakewood Drive West,<br />Suite # 11</p>
              <p className="text-sm">Lakewood, WA 98499-7951</p>
              <p><a href="tel:12535906628" className="text-neon-orange hover:text-red-400 transition-colors text-sm" data-testid="footer-phone">(253) 590-6628</a></p>
              <p><a href="mailto:ericquinn@firehouselawyer2.com" className="text-neon-orange hover:text-red-400 transition-colors text-sm break-words" data-testid="footer-email">ericquinn@firehouselawyer2.com</a></p>
            </div>
          </div>
        </div>

        <div className="border-t border-neon-orange mt-16 pt-12">
          {/* Legal Disclaimer */}
          <div className="mb-12 text-sm text-gray-200 leading-loose max-w-6xl mx-auto font-montserrat">
            <h4 className="text-xl text-gray-100 font-bebas font-semibold mb-6 tracking-wide text-shadow-gritty">LEGAL DISCLAIMER</h4>
            <p className="text-base leading-relaxed">
              The information, materials and references on this web site are for informational purposes only and are not for the purpose of providing legal advice. You should consult an attorney to obtain advice with respect to any particular issue or problem. Should you wish to retain the firm's services, please contact us at 253-590-6628. Use of this website or any of the links contained herein does not create an attorney-client relationship, nor can the firm be responsible for the content of any outside website. Any information provided herein is not intended in any way to waive attorney-client privilege or attorney work product.
            </p>
          </div>
          
          <div className="text-center text-gray-100 font-montserrat">
            <p className="text-sm">&copy; 2025 Eric T. Quinn, P.S. All rights reserved. | Representing the Fire Service and Public Agencies</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
