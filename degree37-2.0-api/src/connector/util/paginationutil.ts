interface APIResponse<T> {
  limit: number;
  nextStart: string;
  isNext: boolean;
  data: T[];
}

export class PaginationUtil<T> {
  private currentPage: number;
  private data: T[] = [];

  constructor(private fetchData: (page: number) => Promise<APIResponse<T>>) {
    this.currentPage = 1;
  }

  async getNextPage(): Promise<APIResponse<T> | null> {
    const response = await this.fetchData(this.currentPage);
    this.currentPage++;

    if (response.isNext) {
      this.data = this.data.concat(response.data);
    }

    return response.isNext ? response : null;
  }

  getAllData(): T[] {
    return this.data;
  }
}
