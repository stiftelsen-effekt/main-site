import { MessageCircle } from "react-feather";

export default {
  name: 'testimonials',
  type: 'object',
  title: 'Testimonials',
  icon: MessageCircle,
  fields: [
    {
      name: 'testimonials',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'testimonial' }}],
    }
  ]
}