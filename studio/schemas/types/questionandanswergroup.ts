import { HelpCircle } from "react-feather";
import { QuestionAndAnswerGroupPreview } from "../../components/questionAndAnswerGroupPreview";

export default {
  name: "questionandanswergroup",
  type: "object",
  title: "Q&A",
  icon: HelpCircle,
  fields: [
    {
      name: "title",
      type: "string",
      title: "Title",
    },
    {
      name: "answers",
      title: "Question and answers",
      type: "array",
      of: [{ type: "questionandanswer" }],
    },
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
} as const;
