interface SurveyAnswer {
  image?: string
  answer: string

}

export interface AddSurveyParams {
  question: string
  answers: SurveyAnswer[]

}

export interface AddSurvey {
  add: (data: AddSurveyParams) => Promise<void>
}
