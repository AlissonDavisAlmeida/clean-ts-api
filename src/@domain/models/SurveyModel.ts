export interface SurveyModel {
  id: string
  question: string
  answers: SurveyAnswer[]
  date: Date
}

interface SurveyAnswer {
  image: string
  answer: string

}
