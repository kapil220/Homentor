import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import LeadCaptureForm from "@/comp/LeadCaptureForm";

const StickyLeadButton = () => {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero");
    const finalCta = document.getElementById("final-cta");
    const targets = [hero, finalCta].filter(Boolean) as HTMLElement[];
    if (targets.length === 0) {
      setVisible(true);
      return;
    }

    const states = new Map<Element, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) states.set(e.target, e.isIntersecting);
        const anyVisible = Array.from(states.values()).some(Boolean);
        setVisible(!anyVisible);
      },
      { threshold: 0.15 }
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.button
            key="sticky"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
            onClick={() => setOpen(true)}
            aria-label="Get a free demo"
            className="lg:hidden fixed bottom-4 right-4 z-40 inline-flex items-center gap-2 bg-homentor-coral hover:bg-[#ff5944] text-white font-semibold px-4 h-12 rounded-full shadow-2xl shadow-orange-900/20"
          >
            <Sparkles className="w-4 h-4" />
            Free demo
          </motion.button>
        )}
      </AnimatePresence>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md p-0 overflow-hidden bg-transparent border-none shadow-none">
          <DialogTitle className="sr-only">Book a free demo</DialogTitle>
          <LeadCaptureForm variant="card" source="sticky-mobile" />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default StickyLeadButton;
