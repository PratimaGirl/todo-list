class Task {
  _id: string;
  userId: string;
  title: string;
  description: string;
  date: Date;
  status: string;
  priority: string;

  constructor() {
    this.title = '';
    this.description = '';
    this.date = new Date();
    this.status = '';
  }
}

export default Task;
