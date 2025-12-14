import React, { useState, useEffect } from 'react';
import { ViewState, Template } from './types';
import { TEMPLATES } from './constants';
import { fetchTemplates, subscribeToTemplateUpdates } from './services/templateService';
import TemplateCard from './components/TemplateCard';
import BlueprintChat from './components/BlueprintChat';
import DashboardDemo from './components/DashboardDemo';
import AuthModal from './components/AuthModal';
import { supabase } from './services/supabase';
import { User } from '@supabase/supabase-js';
import { 
  LayoutDashboard, 
  Store, 
  Bot, 
  Menu, 
  X, 
  ChevronRight, 
  ShieldCheck, 
  IndianRupee, 
  Clock,
  LogIn,
  LogOut,
  User as UserIcon
} from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Template State
  const [templates, setTemplates] = useState<Template[]>(TEMPLATES);

  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // Load Templates & Auth
  useEffect(() => {
    // 1. Initial Data Load
    const loadTemplates = async () => {
      const data = await fetchTemplates();
      setTemplates(data);
    };
    loadTemplates();

    // 2. Realtime Subscription for Metadata
    const subscription = subscribeToTemplateUpdates(() => {
      loadTemplates();
    });

    // 3. Auth Check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    const { data: { subscription: authListener } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
      authListener.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setView('home');
  };

  const handleGetStarted = () => {
    if (user) {
      setView('templates');
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const NavButton: React.FC<{ target: ViewState; icon: React.ReactNode; label: string }> = ({ target, icon, label }) => (
    <button
      onClick={() => {
        setView(target);
        setIsMobileMenuOpen(false);
      }}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
        view === target ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-600 hover:bg-slate-50'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          setIsAuthModalOpen(false);
        }}
      />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
              <div className="bg-indigo-600 p-1.5 rounded-lg">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">VyapaarExcel</span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-2">
              <NavButton target="home" icon={<Store className="w-4 h-4" />} label="Home" />
              <NavButton target="templates" icon={<LayoutDashboard className="w-4 h-4" />} label="Templates" />
              <NavButton target="blueprint" icon={<Bot className="w-4 h-4" />} label="Blueprint AI" />
              
              <div className="h-6 w-px bg-slate-200 mx-2"></div>

              {!authLoading && (
                <>
                  {user ? (
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                          <UserIcon className="w-4 h-4" />
                        </div>
                        <span className="hidden lg:inline">{user.email?.split('@')[0]}</span>
                      </div>
                      <button 
                        onClick={handleSignOut}
                        className="text-slate-500 hover:text-red-600 transition-colors p-2"
                        title="Sign Out"
                      >
                        <LogOut className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setIsAuthModalOpen(true)}
                      className="text-slate-600 hover:text-indigo-600 font-medium text-sm px-4 py-2"
                    >
                      Sign In
                    </button>
                  )}

                  {!user && (
                     <button 
                      onClick={handleGetStarted}
                      className="ml-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-full text-sm font-medium transition-colors"
                    >
                      Get Started
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-slate-600"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white p-4 space-y-2">
            <NavButton target="home" icon={<Store className="w-4 h-4" />} label="Home" />
            <NavButton target="templates" icon={<LayoutDashboard className="w-4 h-4" />} label="Templates" />
            <NavButton target="blueprint" icon={<Bot className="w-4 h-4" />} label="Blueprint AI" />
            <div className="border-t border-slate-100 my-2 pt-2">
               {user ? (
                 <button onClick={handleSignOut} className="flex items-center gap-2 w-full px-4 py-2 text-red-600">
                   <LogOut className="w-4 h-4" /> Sign Out
                 </button>
               ) : (
                 <button onClick={() => { setIsAuthModalOpen(true); setIsMobileMenuOpen(false); }} className="flex items-center gap-2 w-full px-4 py-2 text-indigo-600">
                   <LogIn className="w-4 h-4" /> Sign In
                 </button>
               )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {view === 'home' && (
          <div className="flex flex-col">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-white border-b border-slate-200 pt-16 pb-24 px-4">
              <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                    </span>
                    Made for Indian SMEs
                  </div>
                  <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
                    Professional Dashboards. <br />
                    <span className="text-indigo-600">Zero Technical Skills.</span>
                  </h1>
                  <p className="text-lg text-slate-600 max-w-lg">
                    Stop struggling with blank Excel sheets. Get GST-ready, automated templates for Sales, Inventory, and HR. Launch your MIS system in 10 minutes.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <button 
                      onClick={handleGetStarted}
                      className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                    >
                      {user ? 'View Dashboard' : 'Get Started Free'}
                    </button>
                    <button 
                      onClick={() => setView('blueprint')}
                      className="bg-white text-slate-700 border border-slate-200 px-8 py-3 rounded-lg font-semibold hover:bg-slate-50 transition-colors flex items-center gap-2"
                    >
                      <Bot className="w-4 h-4" /> Ask Expert AI
                    </button>
                  </div>
                  
                  <div className="pt-6 flex items-center gap-6 text-sm text-slate-500">
                    <div className="flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4 text-green-500" />
                      GST Compliant
                    </div>
                    <div className="flex items-center gap-1">
                      <IndianRupee className="w-4 h-4 text-green-500" />
                      Affordable (₹299)
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl opacity-10 blur-xl"></div>
                  <div className="relative">
                    <DashboardDemo />
                  </div>
                </div>
              </div>
            </section>

            {/* Value Props */}
            <section className="py-20 bg-slate-50">
              <div className="max-w-7xl mx-auto px-4">
                <div className="text-center max-w-2xl mx-auto mb-16">
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Indian SMEs Choose Us?</h2>
                  <p className="text-slate-600">We understand the unique challenges of cash transactions, GST filing, and staff management in India.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                  <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                      <Clock className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Save 10+ Hours/Week</h3>
                    <p className="text-sm text-slate-500">Automated calculations for daily sales and salaries. Stop manual totaling.</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                      <ShieldCheck className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">100% GST Ready</h3>
                    <p className="text-sm text-slate-500">Built-in formulas for CGST, SGST, IGST splits. Ready for GSTR-3B summary.</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                      <IndianRupee className="w-6 h-6 text-orange-600" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Affordable Pricing</h3>
                    <p className="text-sm text-slate-500">Pay once, use forever. No expensive monthly SaaS subscriptions for basic needs.</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {view === 'templates' && (
          <div className="py-12 max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Ready-to-Use Templates</h2>
              <p className="text-slate-600">Choose a template to preview its features and structure.</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {templates.map(t => (
                <TemplateCard key={t.id} template={t} onPreview={() => {}} />
              ))}
            </div>

            {/* Pricing Model Section */}
            <div className="mt-20 bg-slate-900 rounded-2xl p-8 lg:p-12 text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
               <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                  <div>
                    <h3 className="text-2xl font-bold mb-4">Enterprise Subscription</h3>
                    <p className="text-slate-300 mb-6">Get access to ALL current and future templates + Priority Support.</p>
                    <ul className="space-y-3 mb-8">
                      <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div> All 20+ Premium Templates</li>
                      <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div> Power BI Dashboards Included</li>
                      <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div> Monthly Strategy Calls</li>
                    </ul>
                    <button className="bg-white text-slate-900 px-6 py-3 rounded-lg font-bold hover:bg-slate-100 transition-colors">
                      {user ? 'Upgrade to Pro' : 'Get All Access for ₹999/mo'}
                    </button>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/10">
                    <h4 className="font-semibold mb-4 text-indigo-300">Custom Development</h4>
                    <p className="text-sm text-slate-300 mb-4">Need specific branding or custom KPI logic? We build custom trackers starting at ₹1,999.</p>
                    <button onClick={() => setView('blueprint')} className="text-sm font-semibold underline decoration-indigo-400 hover:text-indigo-300">
                      Chat with AI to spec your needs &rarr;
                    </button>
                  </div>
               </div>
            </div>
          </div>
        )}

        {view === 'blueprint' && (
          <div className="py-8 max-w-4xl mx-auto px-4 h-[calc(100vh-64px)] flex flex-col">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900">AI Business Consultant</h2>
              <p className="text-slate-600 text-sm">Use our Gemini-powered assistant to plan your template strategy, check GST rules, or design custom columns.</p>
            </div>
            <div className="flex-1">
              <BlueprintChat />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 px-4 mt-auto">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
               <div className="bg-slate-900 p-1 rounded">
                <LayoutDashboard className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-slate-900">VyapaarExcel</span>
            </div>
            <p className="text-sm text-slate-500">Helping Indian businesses grow with data.</p>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><a href="#" className="hover:text-indigo-600">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-indigo-600">Terms of Service</a></li>
              <li><a href="#" className="hover:text-indigo-600">Refund Policy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>support@vyapaarexcel.in</li>
              <li>+91 98765 43210</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-4">Trust</h4>
            <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
              <ShieldCheck className="w-4 h-4 text-green-600" />
              <span>SSL Secure Payment</span>
            </div>
            <p className="text-xs text-slate-400">All templates are tested for virus & macros safety.</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-slate-100 text-center text-xs text-slate-400">
          © 2024 VyapaarExcel. Built for the Indian Economy.
        </div>
      </footer>
    </div>
  );
};

export default App;