export interface SurveyModel {
  question: string
  answers: SurveyAnswer[]

}

interface SurveyAnswer {
  image: string
  answer: string

}
