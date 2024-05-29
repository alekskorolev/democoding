export interface IQuestCondition {
  title: string
}

export interface IReward {
  title: string
  conditions: Array<IQuestCondition>
}

export interface IQuest {
  title: string
  description: string
  briefing: string
  poster: string
  map: string
  rewards: Array<IReward>
  completeConditions: Array<IQuestCondition>
}
