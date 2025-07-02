import { defineType, defineField } from "sanity";
import { HelpCircle } from "react-feather";
import { QuestionAndAnswerGroupPreview } from "../../components/questionAndAnswerGroupPreview";

export default defineType({
  name: "questionandanswergroup",
  type: "object",
  title: "Q&A",
  icon: HelpCircle,
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
    }),
    defineField({
      name: "answers",
      title: "Question and answers",
      type: "array",
      of: [{ type: "questionandanswer" }],
    }),
  ],
  preview: {
    select: {
      title: "title",
      answers: "answers",
    },
  },
  components: {
    preview: QuestionAndAnswerGroupPreview,
  },
});
