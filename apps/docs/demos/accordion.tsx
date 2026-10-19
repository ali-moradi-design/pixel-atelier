import { Accordion, AccordionItem } from "pixel-atelier/accordion";

export default function Demo() {
  return (
    <Accordion className="w-full max-w-md">
      <AccordionItem title="Is it accessible?" defaultOpen>
        Yes. Every effect also runs on keyboard focus.
      </AccordionItem>
      <AccordionItem title="Can I change the accent?">
        Set data-accent on any element.
      </AccordionItem>
      <AccordionItem title="Does it support RTL?">
        Yes, with logical properties.
      </AccordionItem>
    </Accordion>
  );
}
