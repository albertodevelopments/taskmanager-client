export interface Project {
  id: string,
  name: string,
  description: string,
  startAt: Date | null,
  dueDate: Date | null,
  status: number,
  tag1: number,
  tag2: number,
  tag3: number
}

export const EmptyProject: Project = {
  id: '',
  name: '',
  description: '',
  startAt: null,
  dueDate: null,
  status: 0,
  tag1: 0,
  tag2: 0,
  tag3: 0
}
