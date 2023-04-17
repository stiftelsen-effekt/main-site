import { MessageCircle } from "react-feather";
import { TestimonialsPreview } from "../../components/testimonialsPreview";

export default {
  name: "testimonials",
  type: "object",
  title: "Testimonials",
  icon: MessageCircle,
  fields: [
    {
      name: "testimonials",
      type: "array",
      of: [{ type: "reference", to: { type: "testimonial" } }],
    },
  ],
  preview: {
    select: {
      testimonial1quotee: "testimonials.0.quotee",
      testimonial2quotee: "testimonials.1.quotee",
      testimonial3quotee: "testimonials.2.quotee",
      testimonial4quotee: "testimonials.3.quotee",
      testimonial5quotee: "testimonials.4.quotee",
      testimonial1quote: "testimonials.0.quote",
      testimonial2quote: "testimonials.1.quote",
      testimonial3quote: "testimonials.2.quote",
      testimonial4quote: "testimonials.3.quote",
      testimonial5quote: "testimonials.4.quote",
    },
    prepare: ({
      testimonial1quotee,
      testimonial2quotee,
      testimonial3quotee,
      testimonial4quotee,
      testimonial5quotee,
      testimonial1quote,
      testimonial2quote,
      testimonial3quote,
      testimonial4quote,
      testimonial5quote,
    }: {
      testimonial1quotee: string;
      testimonial2quotee: string;
      testimonial3quotee: string;
      testimonial4quotee: string;
      testimonial5quotee: string;
      testimonial1quote: string;
      testimonial2quote: string;
      testimonial3quote: string;
      testimonial4quote: string;
      testimonial5quote: string;
    }) => {
      const quotees = [
        testimonial1quotee,
        testimonial2quotee,
        testimonial3quotee,
        testimonial4quotee,
        testimonial5quotee,
      ].filter(Boolean);
      const quotes = [
        testimonial1quote,
        testimonial2quote,
        testimonial3quote,
        testimonial4quote,
        testimonial5quote,
      ].filter(Boolean);
      return {
        testimonials: quotees.map((quotee, index) => ({
          quotee,
          quote: quotes[index],
        })),
      };
    },
    component: TestimonialsPreview,
  },
} as const;
