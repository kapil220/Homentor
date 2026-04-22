import React, { useState } from "react";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { Plus, Minus } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  title?: string;
  description?: string;
  items: FAQItem[];
}

const FAQSection: React.FC<FAQSectionProps> = ({
  title = "Frequently Asked Questions",
  description = "Answers to the questions parents ask us most.",
  items,
}) => {
  const [openItems, setOpenItems] = useState<Record<number, boolean>>({});

  const toggleItem = (index: number) => {
    setOpenItems((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-blue-50 text-homentor-blue border border-blue-100">
            FAQ
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
            {title}
          </h2>
          <p className="mt-3 text-slate-600">{description}</p>
        </div>

        <div className="space-y-3">
          {items.map((item, index) => (
            <Collapsible
              key={index}
              open={!!openItems[index]}
              onOpenChange={() => toggleItem(index)}
              className="rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-colors overflow-hidden"
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full px-5 py-4 text-left group">
                <h3 className="text-base font-medium text-slate-900 pr-4">
                  {item.question}
                </h3>
                <div className="shrink-0 w-8 h-8 rounded-lg bg-slate-50 group-hover:bg-blue-50 flex items-center justify-center transition-colors">
                  {openItems[index] ? (
                    <Minus className="h-4 w-4 text-homentor-blue" />
                  ) : (
                    <Plus className="h-4 w-4 text-slate-500 group-hover:text-homentor-blue" />
                  )}
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="overflow-hidden">
                <div className="px-5 pb-5 pt-0 text-slate-600 leading-relaxed text-sm">
                  {item.answer}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
