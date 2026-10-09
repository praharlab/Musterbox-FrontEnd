// src/app/models/policyData.ts

export class PolicyData {
    type: string;
    setPolicy: boolean;
    setPolicy_category: string;
    limit: number | null;
    disable:boolean;
  
    constructor(type: string) {
      this.type = type;
      this.setPolicy = false;
      this.setPolicy_category = '';
      this.limit = null;
      this.disable = false
    }
  
    // Optional: you can add methods to manipulate or fetch data
    updateData(data): void {
      // this.setPolicy_category = category;
    }
  
    setLimit(limit: number): void {
      this.limit = limit;
    }
  
    getPolicyData() {
      return {
        type: this.type,
        setPolicy: this.setPolicy,
        setPolicy_category: this.setPolicy_category,
        limit: this.limit
      };
    }
  }
  